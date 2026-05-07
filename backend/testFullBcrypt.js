const bcrypt = require('bcryptjs');

const test = async () => {
  const pass = 'mypassword';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pass, salt);
  console.log('Hash:', hash);
  const result = await bcrypt.compare(pass, hash);
  console.log('Match:', result);
};

test();
