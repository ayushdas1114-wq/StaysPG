const bcrypt = require('bcryptjs');

const hash = '$2b$10$j2gUCzodBT69NOUURHcWuu0HmwH79CQFcHxuo3oXYrUsP0NwbUqb6';
const pass = '123456';

const test = async () => {
  const result = await bcrypt.compare(pass, hash);
  console.log('Match:', result);
};

test();
