const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis Client Connected');
        this.isConnected = true;
      });

      this.client.on('end', () => {
        console.log('Redis Client Disconnected');
        this.isConnected = false;
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  async get(key) {
    try {
      if (!this.isConnected) await this.connect();
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key, value, expireSeconds = 3600) {
    try {
      if (!this.isConnected) await this.connect();
      await this.client.set(key, JSON.stringify(value), {
        EX: expireSeconds
      });
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  }

  async del(key) {
    try {
      if (!this.isConnected) await this.connect();
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  }

  async exists(key) {
    try {
      if (!this.isConnected) await this.connect();
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }

  async keys(pattern) {
    try {
      if (!this.isConnected) await this.connect();
      return await this.client.keys(pattern);
    } catch (error) {
      console.error('Redis KEYS error:', error);
      return [];
    }
  }

  async flush() {
    try {
      if (!this.isConnected) await this.connect();
      await this.client.flushAll();
      return true;
    } catch (error) {
      console.error('Redis FLUSH error:', error);
      return false;
    }
  }

  // Cache specific methods
  async cacheProduct(productId, productData) {
    const key = `product:${productId}`;
    return await this.set(key, productData, 1800); // 30 minutes
  }

  async getCachedProduct(productId) {
    const key = `product:${productId}`;
    return await this.get(key);
  }

  async cacheProducts(query, products, page = 1) {
    const key = `products:${JSON.stringify(query)}:page:${page}`;
    return await this.set(key, products, 600); // 10 minutes
  }

  async getCachedProducts(query, page = 1) {
    const key = `products:${JSON.stringify(query)}:page:${page}`;
    return await this.get(key);
  }

  async invalidateProductCache(productId) {
    // Remove specific product cache
    await this.del(`product:${productId}`);
    
    // Invalidate all product lists cache
    const productListKeys = await this.keys('products:*');
    for (const key of productListKeys) {
      await this.del(key);
    }
    
    return true;
  }

  // Session management
  async cacheSession(sessionId, sessionData) {
    const key = `session:${sessionId}`;
    return await this.set(key, sessionData, 86400); // 24 hours
  }

  async getSession(sessionId) {
    const key = `session:${sessionId}`;
    return await this.get(key);
  }

  async deleteSession(sessionId) {
    const key = `session:${sessionId}`;
    return await this.del(key);
  }

  // Rate limiting
  async rateLimit(key, limit, windowSeconds) {
    const now = Date.now();
    const windowStart = now - (windowSeconds * 1000);
    
    try {
      if (!this.isConnected) await this.connect();
      
      // Add current timestamp to sorted set
      await this.client.zAdd(key, { score: now, value: now.toString() });
      
      // Remove old timestamps
      await this.client.zRemRangeByScore(key, 0, windowStart);
      
      // Get count of requests in window
      const count = await this.client.zCard(key);
      
      // Set expiry on the key
      await this.client.expire(key, windowSeconds);
      
      return {
        allowed: count <= limit,
        remaining: Math.max(0, limit - count),
        reset: new Date(now + (windowSeconds * 1000))
      };
    } catch (error) {
      console.error('Rate limiting error:', error);
      return { allowed: true, remaining: limit, reset: new Date() };
    }
  }
}

// Create singleton instance
const redisClient = new RedisClient();

module.exports = redisClient;