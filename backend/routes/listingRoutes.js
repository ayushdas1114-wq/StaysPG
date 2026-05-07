const express = require('express');
const router = express.Router();
const { getListings, getListingById, getMyListings, createListing, deleteListing } = require('../controllers/listingController');
const { protect, ownerOnly } = require('../middleware/authMiddleware');

router.get('/', getListings);
router.get('/my', protect, ownerOnly, getMyListings);
router.get('/:id', getListingById);
router.post('/', protect, ownerOnly, createListing);
router.delete('/:id', protect, ownerOnly, deleteListing);

module.exports = router;
