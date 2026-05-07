require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Delete existing admin if any
  await User.deleteOne({ email: 'admin@example.com' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);

  await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'owner',
    phone: '9999999999'
  });

  console.log('Admin user created: admin@example.com / admin123');
  process.exit();
};

createAdmin();
