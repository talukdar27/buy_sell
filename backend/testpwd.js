const bcrypt = require('bcryptjs');

// Replace this with the plain text password you are testing
  const plainPassword = '123';

// Replace this with the hashed password from your database
const hashedPassword = '$2a$10$IrrKc3Qljuhl3fT/qNVoBePn/0z9U4elqCTlkRxnEnrDF1zdzXj4O'; 

// Compare the plain password with the hashed password
bcrypt.compare(plainPassword, hashedPassword)
  .then((isMatch) => {
  console.log('Password matches:', isMatch);
  })
  .catch((error) => {
    console.error('Error during password comparison:', error);
  });
