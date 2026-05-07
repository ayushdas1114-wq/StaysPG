const express = require('express');
const router = express.Router();
const { getListings, getListingById, getMyListings, createListing, updateListing, deleteListing } = require('../controllers/listingController');
const { protect, ownerOnly } = require('../middleware/authMiddleware');

router.get('/', getListings);
router.get('/my', protect, ownerOnly, getMyListings);
router.get('/:id', getListingById);
router.post('/', protect, ownerOnly, createListing);
router.put('/:id', protect, ownerOnly, updateListing);
router.delete('/:id', protect, ownerOnly, deleteListing);

module.exports = router;
