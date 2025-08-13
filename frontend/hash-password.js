// Usage: node hash-password.js "plaintext"
// Example: node hash-password.js "bader123*/"
const bcrypt = require('bcrypt');

async function run() {
  const pwd = process.argv[2];
  if (!pwd) {
    console.error('Provide a password: node hash-password.js "yourPassword"');
    process.exit(1);
  }
  const hash = await bcrypt.hash(pwd, 10);
  console.log(hash);
}
run();
