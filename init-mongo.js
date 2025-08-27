// MongoDB initialization script
// This script imports the initial data from JSON files

const fs = require('fs');

// Create database
db = db.getSiblingDB('lonca_vendor_dashboard');

// Import vendors
const vendorsData = JSON.parse(fs.readFileSync('/data/vendors.json', 'utf8'));
db.vendors.insertMany(vendorsData);
print(`Imported ${vendorsData.length} vendors`);

// Import products
const productsData = JSON.parse(fs.readFileSync('/data/parent_products.json', 'utf8'));
db.parent_products.insertMany(productsData);
print(`Imported ${productsData.length} products`);

// Import orders
const ordersData = JSON.parse(fs.readFileSync('/data/orders.json', 'utf8'));
db.orders.insertMany(ordersData);
print(`Imported ${ordersData.length} orders`);

// Create indexes
db.orders.createIndex({ payment_at: -1 });
db.orders.createIndex({ 'cart_item.product': 1 });
db.parent_products.createIndex({ vendor: 1 });
db.vendors.createIndex({ name: 'text' });

print('Database initialization completed');