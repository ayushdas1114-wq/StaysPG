require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/Listing');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { family: 4 });
  console.log('Connected to DB');

  // Ensure an owner exists
  let owner = await User.findOne({ email: 'iterowner@gmail.com' });
  if (!owner) {
    const hashed = await bcrypt.hash('owner123', 10);
    owner = await User.create({
      name: 'Rajesh Patel',
      email: 'iterowner@gmail.com',
      password: hashed,
      role: 'owner',
      phone: '9876543210'
    });
    console.log('Created owner: Rajesh Patel (iterowner@gmail.com / owner123)');
  } else {
    console.log('Owner already exists');
  }

  // 5 listings near ITER, Jagamara, Bhubaneswar
  // ITER campus coords: approx 20.2506, 85.7984
  const listings = [
    {
      title: 'Boys PG near ITER Main Gate',
      category: 'PG',
      suitableFor: 'Boys',
      location: 'Jagamara',
      landmark: 'ITER Main Gate',
      rent: 5500,
      deposit: '1 Month Rent',
      amenities: ['WiFi', 'Food Facility', 'RO Water', 'Power Backup'],
      isAvailable: true,
      lat: 20.2512,
      lng: 85.7991,
      contact: '9876543210',
      ownerId: owner._id,
      ownerName: owner.name
    },
    {
      title: 'Girls PG with AC & Food - ITER',
      category: 'PG',
      suitableFor: 'Girls',
      location: 'Khandagiri',
      landmark: 'ITER Back Gate',
      rent: 7000,
      deposit: '2 Months Rent',
      amenities: ['WiFi', 'AC', 'Food Facility', 'CCTV', 'RO Water'],
      isAvailable: true,
      lat: 20.2498,
      lng: 85.7965,
      contact: '9876543210',
      ownerId: owner._id,
      ownerName: owner.name
    },
    {
      title: 'Affordable 1BHK Flat near SOA University',
      category: 'Flat',
      suitableFor: 'Any',
      location: 'Jagamara',
      landmark: 'SOA University',
      rent: 8500,
      deposit: '2 Months Rent',
      bhk: '1 BHK',
      amenities: ['WiFi', 'Parking', 'Power Backup'],
      isAvailable: true,
      lat: 20.2523,
      lng: 85.8012,
      contact: '9876543210',
      ownerId: owner._id,
      ownerName: owner.name
    },
    {
      title: 'Spacious 2BHK near ITER with Parking',
      category: 'Flat',
      suitableFor: 'Any',
      location: 'Khandagiri',
      landmark: 'Khandagiri Square',
      rent: 12000,
      deposit: '1 Month Rent',
      bhk: '2 BHK',
      amenities: ['WiFi', 'AC', 'Parking', 'Washing Machine', 'Power Backup'],
      isAvailable: true,
      lat: 20.2489,
      lng: 85.7946,
      contact: '9876543210',
      ownerId: owner._id,
      ownerName: owner.name
    },
    {
      title: "Owner's House Room - Walking Distance to ITER",
      category: "Owner's House",
      suitableFor: 'Boys',
      location: 'Jagamara',
      landmark: 'ITER Campus Road',
      rent: 4000,
      deposit: '1 Month Rent',
      amenities: ['WiFi', 'RO Water', 'Food Facility'],
      isAvailable: false, // This one is occupied - to test the feature
      lat: 20.2535,
      lng: 85.8001,
      contact: '9876543210',
      ownerId: owner._id,
      ownerName: owner.name
    }
  ];

  for (const listing of listings) {
    const exists = await Listing.findOne({ title: listing.title });
    if (!exists) {
      await Listing.create(listing);
      console.log(`Created: ${listing.title}`);
    } else {
      console.log(`Already exists: ${listing.title}`);
    }
  }

  // Sync indexes
  await Listing.syncIndexes();
  console.log('Indexes synced');

  await mongoose.disconnect();
  console.log('Done! 5 listings near ITER are now in the database.');
}

seed().catch(err => { console.error(err); process.exit(1); });
