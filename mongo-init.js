db.createUser({
  user: 'admin',
  pwd: 'admin123',
  roles: [
    {
      role: 'readWrite',
      db: 'ecommerce_db'
    }
  ]
});

// Create collections and indexes
db = db.getSiblingDB('ecommerce_db');

// Users collection
db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ phone: 1 }, { unique: true });

// Products collection
db.createCollection('products');
db.products.createIndex({ name: 'text', description: 'text', category: 'text' });
db.products.createIndex({ category: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ featured: 1 });
db.products.createIndex({ status: 1 });

// Orders collection
db.createCollection('orders');
db.orders.createIndex({ user: 1 });
db.orders.createIndex({ orderNumber: 1 }, { unique: true });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });
db.orders.createIndex({ 'user.email': 1 });

// Categories collection
db.createCollection('categories');
db.categories.createIndex({ name: 1 }, { unique: true });
db.categories.createIndex({ slug: 1 }, { unique: true });

// Reviews collection
db.createCollection('reviews');
db.reviews.createIndex({ product: 1, user: 1 }, { unique: true });
db.reviews.createIndex({ rating: 1 });

// Coupons collection
db.createCollection('coupons');
db.coupons.createIndex({ code: 1 }, { unique: true });
db.coupons.createIndex({ expiresAt: 1 });

// Sessions collection for express-session
db.createCollection('sessions');
db.sessions.createIndex({ expires: 1 }, { expireAfterSeconds: 0 });

print('✅ MongoDB initialization completed');