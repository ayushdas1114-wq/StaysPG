const Listing = require('../models/Listing');

const getListings = async (req, res) => {
  try {
    const { search, category, gender, maxPrice } = req.query;
    console.log('Fetching listings with query:', req.query);
    let query = {};

    if (search) {
      query.$or = [
        { location: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { landmark: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (gender) {
      query.suitableFor = { $in: [gender, 'Any'] };
    }

    if (maxPrice) {
      query.rent = { $lte: Number(maxPrice) };
    }

    console.log('Final Mongo Query:', JSON.stringify(query));
    const result = await Listing.find(query).sort({ createdAt: -1 });
    console.log('Result count:', result.length);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getListings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (listing) res.status(200).json(listing);
    else res.status(404).json({ message: 'Listing not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyListings = async (req, res) => {
  try {
    const myListings = await Listing.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(myListings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createListing = async (req, res) => {
  try {
    const data = req.body;

    const newListing = await Listing.create({
      ...data,
      ownerId: req.user._id,
      ownerName: req.user.name,
      contact: data.contact || req.user.phone
    });

    res.status(201).json(newListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (listing) {
      res.status(200).json(listing);
    } else {
      res.status(404).json({ message: 'Unauthorized or not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
    if (listing) {
      res.status(200).json({ message: 'Listing deleted' });
    } else {
      res.status(404).json({ message: 'Unauthorized or not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getListings, getListingById, getMyListings, createListing, updateListing, deleteListing };

