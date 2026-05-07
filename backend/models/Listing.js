const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['PG', 'Flat', 'Mess', "Owner's House"], default: 'PG' },
  suitableFor: { type: String, enum: ['Boys', 'Girls', 'Any'], default: 'Any' },
  location: { type: String, required: true },
  landmark: { type: String, default: '' },
  rent: { type: Number, required: true },
  deposit: { type: String, default: '' },
  bhk: { type: String, default: '' },
  amenities: { type: [String], default: [] },
  images: { type: [String], default: [] },
  contact: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  lat: { type: Number, default: 20.2961 }, // Default Bhubaneswar Lat
  lng: { type: Number, default: 85.8245 }, // Default Bhubaneswar Lng
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerName: { type: String, default: 'Owner' },
  createdAt: { type: Date, default: Date.now }
});

listingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Listing', listingSchema);
