require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB, mongoose } = require('./config/db');
const Role = require('./models/Role');
const User = require('./models/User');
const Category = require('./models/Category');
const Location = require('./models/Location');
const Item = require('./models/Item');

async function upsertRole(name) {
  return Role.findOneAndUpdate({ name }, { name }, { upsert: true, new: true });
}

async function main() {
  await connectDB();

  const roleNames = ['Admin', 'Manager', 'Inventory Manager', 'Employee', 'Auditor'];
  const roles = {};
  for (const name of roleNames) {
    roles[name] = await upsertRole(name);
  }

  const demoUsers = [
    { name: 'Admin User', email: 'admin@example.com', password: 'Admin@123', role: 'Admin' },
    { name: 'Manager User', email: 'manager@example.com', password: 'Manager@123', role: 'Manager' },
    { name: 'Employee User', email: 'employee@example.com', password: 'Employee@123', role: 'Employee' },
  ];

  for (const u of demoUsers) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await User.findOneAndUpdate(
      { email: u.email },
      { name: u.name, email: u.email, passwordHash, role: roles[u.role]._id },
      { upsert: true, new: true }
    );
  }

  const category = await Category.findOneAndUpdate(
    { name: 'General' },
    { name: 'General', description: 'General inventory category' },
    { upsert: true, new: true }
  );

  await Location.findOneAndUpdate(
    { name: 'Main Warehouse' },
    { name: 'Main Warehouse', address: 'HQ' },
    { upsert: true, new: true }
  );
  await Location.findOneAndUpdate(
    { name: 'Branch Office' },
    { name: 'Branch Office', address: 'Branch' },
    { upsert: true, new: true }
  );

  await Item.findOneAndUpdate(
    { sku: 'SKU-0001' },
    { name: 'Sample Laptop', sku: 'SKU-0001', category: category._id, quantity: 10 },
    { upsert: true, new: true }
  );

  console.log('Seed complete. Demo credentials:');
  demoUsers.forEach((u) => console.log(`  ${u.role}: ${u.email} / ${u.password}`));

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
