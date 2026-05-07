require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const test = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({});
  console.log('Users in DB:', JSON.stringify(users, null, 2));
  process.exit();
};

test();
