const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

dotenv.config();

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kibanda-fashion';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Enhanced Product Data - 400+ products with realistic Kenyan pricing
const categories = {
  men: [
    'Shirts', 'T-Shirts', 'Trousers', 'Shorts', 'Jackets', 'Suits', 
    'Traditional Wear', 'Sweaters', 'Jeans', 'Activewear', 'Underwear',
    'Swimwear', 'Winter Wear', 'Work Wear', 'Formal Wear'
  ],
  women: [
    'Dresses', 'Tops', 'Skirts', 'Trousers', 'Blouses', 'Jackets',
    'Traditional Wear', 'Jumpsuits', 'Jeans', 'Activewear', 'Lingerie',
    'Swimwear', 'Winter Wear', 'Maternity', 'Formal Wear'
  ],
  kids: [
    'Boys Clothing', 'Girls Clothing', 'Baby Clothes', 'School Uniforms',
    'Shoes', 'Accessories', 'Playwear', 'Party Wear', 'Winter Wear'
  ],
  shoes: [
    'Men Shoes', 'Women Shoes', 'Kids Shoes', 'Sports Shoes',
    'Sandals', 'Formal Shoes', 'Casual Shoes', 'Boots', 'Slippers'
  ],
  accessories: [
    'Bags', 'Jewelry', 'Watches', 'Belts', 'Hats', 'Sunglasses',
    'Wallets', 'Scarves', 'Ties', 'Socks', 'Gloves', 'Hair Accessories'
  ],
  traditional: [
    'Kanga Sets', 'Kitenge Dresses', 'Dashiki Shirts', 'Kikoi Wraps',
    'Maasai Shuka', 'Batik Prints', 'Head Wraps', 'Traditional Jewelry',
    'African Print', 'Cultural Attire', 'Wedding Outfits'
  ]
};

const brands = [
  'Kibanda Premium', 'Kibanda Basics', 'Kibanda Traditional', 
  'Kibanda Kids', 'Kibanda Footwear', 'Kibanda Accessories',
  'African Heritage', 'Nairobi Style', 'Mombasa Designs', 'Lake Victoria',
  'Safari Collection', 'Mount Kenya', 'Rift Valley', 'Coastal Elegance',
  'Maasai Market', 'Kiondos', 'Kitenge Kings', 'Dashiki Masters'
];

const colors = [
  'Red', 'Blue', 'Black', 'White', 'Green', 'Yellow', 
  'Brown', 'Grey', 'Pink', 'Purple', 'Orange', 'Navy',
  'Beige', 'Maroon', 'Teal', 'Gold', 'Silver', 'Multi-color',
  'Cream', 'Khaki', 'Magenta', 'Turquoise', 'Lavender', 'Olive'
];

const sizes = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  shoes: ['6', '7', '8', '9', '10', '11', '12', '13'],
  kids: ['2-4 Years', '4-6 Years', '6-8 Years', '8-10 Years', '10-12 Years'],
  babies: ['0-3 Months', '3-6 Months', '6-12 Months', '12-18 Months', '18-24 Months']
};

// Kenyan traditional colors
const traditionalColors = [
  'African Print', 'Kente Pattern', 'Batik Design', 'Kitenge Pattern',
  'Maasai Red', 'Safari Green', 'Sunset Orange', 'Ocean Blue',
  'Earth Brown', 'Gold Trim', 'Silver Accent', 'Beaded Multi-color'
];

// Enhanced Product descriptions with Kenyan context
const descriptions = [
  'Made with premium quality fabric for maximum comfort and durability in Kenyan weather.',
  'Perfect for casual wear and special occasions across Kenya\'s diverse climate.',
  'Features unique designs inspired by African culture and Kenyan heritage.',
  'Eco-friendly material that is gentle on the skin and supports local sustainability.',
  'Machine washable and colorfast for long-lasting use in Kenyan households.',
  'Versatile piece that can be dressed up or down for any Kenyan occasion.',
  'Breathable fabric suitable for Nairobi, Mombasa, and all Kenyan regions.',
  'Handcrafted with attention to detail by skilled Kenyan artisans.',
  'Modern design with traditional Kenyan elements for contemporary style.',
  'Available in various sizes and colors to suit Kenyan preferences.',
  'Perfect for office wear in Nairobi\'s business districts.',
  'Ideal for weekend outings and social gatherings across Kenya.',
  'Comfortable fit designed for everyday wear in Kenyan lifestyle.',
  'Made from 100% cotton sourced from Kenyan farms for natural comfort.',
  'Lightweight material perfect for Kenya\'s tropical climate.',
  'Durable construction for long-term use in Kenyan conditions.',
  'Stylish design that incorporates Kenyan fashion trends.',
  'Affordable luxury tailored for the modern Kenyan consumer.',
  'Support local Kenyan craftsmanship with this beautiful piece.',
  'Perfect gift for loved ones during Kenyan celebrations and holidays.',
  'Weather-resistant material suitable for Kenya\'s rainy seasons.',
  'Quick-dry fabric ideal for coastal regions of Kenya.',
  'Traditional weaving techniques from different Kenyan communities.',
  'Modern interpretation of classic Kenyan attire.',
  'Sustainable production supporting Kenyan textile industry.'
];

// Kenyan traditional product names
const traditionalProducts = [
  'Kanga Set (2-pieces)',
  'Kitenge Maxi Dress',
  'Dashiki Shirt with Embroidery',
  'Kikoi Beach Wrap',
  'Maasai Beaded Necklace',
  'Traditional Head Wrap',
  'Batik Print Shirt',
  'African Print Jumpsuit',
  'Traditional Wedding Outfit',
  'Cultural Dance Costume',
  'Maasai Shuka Blanket',
  'Kiondo Handwoven Basket',
  'Kitenge Headscarf',
  'Beaded Maasai Bracelet',
  'Traditional Ceremonial Dress',
  'African Print Two-piece',
  'Kente Stole',
  'Batik Wall Hanging',
  'Traditional Child\'s Outfit',
  'Cultural Festival Attire'
];

// Generate random Kenyan names
const generateKenyanName = () => {
  const firstNames = [
    'John', 'Mary', 'David', 'Sarah', 'James', 'Lisa', 'Peter', 'Grace',
    'Michael', 'Jane', 'Joseph', 'Ruth', 'William', 'Esther', 'Robert', 'Joyce',
    'Charles', 'Margaret', 'Thomas', 'Susan', 'Daniel', 'Carol', 'Paul', 'Nancy',
    'Mark', 'Dorothy', 'George', 'Helen', 'Kennedy', 'Irene'
  ];
  
  const lastNames = [
    'Mwangi', 'Kamau', 'Kariuki', 'Njoroge', 'Ochieng', 'Odhiambo', 'Omondi',
    'Otieno', 'Owino', 'Waweru', 'Maina', 'Ndungu', 'Ngugi', 'Njenga', 'Nyaga',
    'Kibet', 'Kipchoge', 'Koech', 'Langat', 'Chebet', 'Jepkosgei', 'Kiplagat',
    'Achieng', 'Adhiambo', 'Akinyi', 'Atieno', 'Awino', 'Awuor', 'Anyango'
  ];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

// Generate random product data with enhanced Kenyan context
const generateProducts = (count) => {
  const products = [];
  const categoryKeys = Object.keys(categories);
  
  // Ensure we get at least 50 products per category
  const productsPerCategory = Math.max(50, Math.floor(count / categoryKeys.length));
  
  for (let categoryIndex = 0; categoryIndex < categoryKeys.length; categoryIndex++) {
    const category = categoryKeys[categoryIndex];
    const subcategories = categories[category];
    
    for (let i = 1; i <= productsPerCategory; i++) {
      const productNumber = (categoryIndex * productsPerCategory) + i;
      if (productNumber > count) break;
      
      const subcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
      
      // Base price based on category with realistic Kenyan pricing
      let basePrice;
      let priceRange;
      
      switch(category) {
        case 'men':
          priceRange = { min: 800, max: 15000 };
          basePrice = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;
          break;
        case 'women':
          priceRange = { min: 700, max: 20000 };
          basePrice = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;
          break;
        case 'kids':
          priceRange = { min: 400, max: 8000 };
          basePrice = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;
          break;
        case 'shoes':
          priceRange = { min: 1200, max: 25000 };
          basePrice = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;
          break;
        case 'accessories':
          priceRange = { min: 300, max: 15000 };
          basePrice = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;
          break;
        case 'traditional':
          priceRange = { min: 1500, max: 35000 };
          basePrice = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;
          break;
        default:
          priceRange = { min: 500, max: 10000 };
          basePrice = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;
      }
      
      // Enhanced discount logic
      // Traditional items have higher chance of discount (40%)
      // Other categories have 30% chance
      const discountChance = category === 'traditional' ? 0.4 : 0.3;
      const hasDiscount = Math.random() < discountChance;
      
      let discount = 0;
      let price = basePrice;
      
      if (hasDiscount) {
        // Discount ranges: 10-60% for traditional, 10-50% for others
        const maxDiscount = category === 'traditional' ? 60 : 50;
        discount = Math.floor(Math.random() * (maxDiscount - 10 + 1)) + 10;
        price = Math.round(basePrice * (1 - discount / 100));
      }
      
      // Product name generation with Kenyan context
      let name;
      if (category === 'traditional') {
        const traditionalName = traditionalProducts[Math.floor(Math.random() * traditionalProducts.length)];
        const adjectives = ['Authentic', 'Genuine', 'Exquisite', 'Handcrafted', 'Artisanal', 'Premium'];
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        name = `${adjective} ${traditionalName} - ${productNumber}`;
      } else {
        const prefixes = ['Classic', 'Modern', 'Stylish', 'Comfort', 'Premium', 'Elegant', 'Trendy', 'Casual', 'Smart', 'Chic'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        
        const types = {
          men: ['Shirt', 'T-Shirt', 'Jeans', 'Trousers', 'Jacket', 'Suit', 'Shorts', 'Sweater', 'Polo', 'Hoodie'],
          women: ['Dress', 'Top', 'Skirt', 'Blouse', 'Jacket', 'Jumpsuit', 'Jeans', 'Trousers', 'Cardigan', 'Leggings'],
          kids: ['Set', 'Outfit', 'Dress', 'Shirt', 'Shorts', 'Jacket', 'Uniform', 'Romper', 'Sweater'],
          shoes: ['Sneakers', 'Loafers', 'Sandals', 'Boots', 'Heels', 'Flats', 'Sports Shoes', 'Slippers', 'Oxfords'],
          accessories: ['Bag', 'Necklace', 'Watch', 'Belt', 'Hat', 'Sunglasses', 'Wallet', 'Scarf', 'Tie', 'Bracelet']
        };
        
        const type = types[category] ? types[category][Math.floor(Math.random() * types[category].length)] : 'Item';
        name = `${prefix} ${subcategory} ${type} ${productNumber}`;
      }
      
      // Generate multiple images (3-5 images per product)
      const imageCount = Math.floor(Math.random() * 3) + 3; // 3-5 images
      const images = [];
      for (let j = 1; j <= imageCount; j++) {
        // Use different image seeds for variety
        images.push(`https://picsum.photos/seed/kibanda${category}${productNumber}${j}/600/800`);
      }
      
      // Generate random colors with category-specific preferences
      const productColors = [];
      const colorCount = Math.floor(Math.random() * 3) + 1; // 1-3 colors
      
      const colorPool = category === 'traditional' ? traditionalColors : colors;
      
      for (let j = 0; j < colorCount; j++) {
        const color = colorPool[Math.floor(Math.random() * colorPool.length)];
        if (!productColors.includes(color)) {
          productColors.push(color);
        }
      }
      
      // Generate sizes based on category
      let productSizes = [];
      if (category === 'shoes') {
        const startIndex = Math.floor(Math.random() * 3);
        productSizes = sizes.shoes.slice(startIndex, startIndex + 4); // 4 consecutive sizes
      } else if (category === 'kids') {
        productSizes = sizes.kids.slice(0, Math.floor(Math.random() * 3) + 2); // 2-4 sizes
      } else if (category === 'accessories') {
        productSizes = ['One Size', 'Adjustable'];
      } else {
        const startIndex = Math.floor(Math.random() * 3);
        productSizes = sizes.clothing.slice(startIndex, startIndex + 4); // 4 consecutive sizes
      }
      
      // Generate tags with Kenyan context
      const tags = [category, subcategory.toLowerCase().replace(' ', '-')];
      if (hasDiscount) {
        tags.push('sale');
        tags.push('discount');
      }
      if (productNumber <= 60) tags.push('featured');
      if (productNumber <= 120) tags.push('new-arrival');
      if (category === 'traditional') tags.push('kenyan-made');
      if (basePrice > 10000) tags.push('premium');
      if (basePrice < 2000) tags.push('affordable');
      
      // Generate realistic reviews
      const reviewCount = Math.floor(Math.random() * 25); // 0-24 reviews
      const reviews = [];
      const reviewerNames = ['John', 'Mary', 'David', 'Sarah', 'James', 'Lisa', 'Peter', 'Grace', 'Michael', 'Jane'];
      const reviewComments = [
        'Great product! Perfect for Kenyan weather.',
        'Very satisfied with the quality.',
        'Good quality and durable.',
        'Would recommend to friends and family.',
        'Perfect fit for Kenyan body types.',
        'Excellent value for money.',
        'Fast delivery within Kenya.',
        'Authentic Kenyan design.',
        'Comfortable for all-day wear.',
        'Beautiful colors and patterns.'
      ];
      
      for (let j = 0; j < reviewCount; j++) {
        reviews.push({
          userId: new mongoose.Types.ObjectId(),
          userName: generateKenyanName(),
          rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
          comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
          date: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000) // Last 180 days
        });
      }
      
      // Calculate average rating
      const rating = reviews.length > 0 
        ? parseFloat((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
        : parseFloat((Math.random() * 2 + 3).toFixed(1)); // 3.0-5.0
      
      // Calculate stock based on popularity (lower rating = less stock)
      const popularityFactor = rating / 5; // 0.6 to 1.0
      const stock = Math.floor(Math.random() * 200 * popularityFactor) + 20;
      
      // Create product object
      const product = {
        name,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        price,
        originalPrice: hasDiscount ? basePrice : undefined,
        category,
        subcategory: subcategory.toLowerCase(),
        images,
        colors: productColors,
        sizes: productSizes,
        brand: brands[Math.floor(Math.random() * brands.length)],
        stock,
        featured: productNumber <= 60,
        discount: hasDiscount ? discount : 0,
        rating,
        reviews,
        tags,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      };
      
      products.push(product);
    }
  }
  
  // Add extra products if needed
  const remainingCount = count - products.length;
  if (remainingCount > 0) {
    const extraProducts = generateProducts(remainingCount);
    products.push(...extraProducts.slice(0, remainingCount));
  }
  
  return products.slice(0, count);
};

// Generate test users with enhanced Kenyan data
const generateUsers = async () => {
  const users = [
    // Admin user
    {
      name: 'Admin Kibanda',
      email: 'admin@kibanda.com',
      password: await bcrypt.hash('Admin123!', 10),
      phone: '0712345678',
      role: 'admin',
      address: {
        street: 'Kibanda Fashion HQ, 123 Fashion Street',
        city: 'Nairobi',
        county: 'Nairobi',
        postalCode: '00100'
      },
      isEmailVerified: true,
      createdAt: new Date('2023-01-01')
    },
    // Regular users
    {
      name: 'John Kamau',
      email: 'john@example.com',
      password: await bcrypt.hash('Password123!', 10),
      phone: '0723456789',
      role: 'customer',
      address: {
        street: '123 Moi Avenue',
        city: 'Mombasa',
        county: 'Mombasa',
        postalCode: '80100'
      },
      isEmailVerified: true,
      createdAt: new Date('2023-03-15')
    },
    {
      name: 'Mary Achieng',
      email: 'mary@example.com',
      password: await bcrypt.hash('Password123!', 10),
      phone: '0734567890',
      role: 'customer',
      address: {
        street: '456 Oginga Odinga Street',
        city: 'Kisumu',
        county: 'Kisumu',
        postalCode: '40100'
      },
      isEmailVerified: true,
      createdAt: new Date('2023-04-20')
    },
    {
      name: 'David Mwangi',
      email: 'david@example.com',
      password: await bcrypt.hash('Password123!', 10),
      phone: '0745678901',
      role: 'customer',
      address: {
        street: '789 Kenyatta Avenue',
        city: 'Nakuru',
        county: 'Nakuru',
        postalCode: '20100'
      },
      isEmailVerified: true,
      createdAt: new Date('2023-05-10')
    },
    {
      name: 'Sarah Akinyi',
      email: 'sarah@example.com',
      password: await bcrypt.hash('Password123!', 10),
      phone: '0756789012',
      role: 'customer',
      address: {
        street: '321 Uganda Road',
        city: 'Eldoret',
        county: 'Uasin Gishu',
        postalCode: '30100'
      },
      isEmailVerified: true,
      createdAt: new Date('2023-06-05')
    }
  ];
  
  // Generate additional random Kenyan users
  const kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 
    'Kitale', 'Kakamega', 'Kisii', 'Meru', 'Nyeri', 'Machakos', 'Kiambu'
  ];
  
  const kenyanCities = [
    'Nairobi CBD', 'Westlands', 'Karen', 'Langata', 'Runda', 'Lavington',
    'Mombasa Island', 'Nyali', 'Bamburi', 'Likoni', 'Kisumu Town', 
    'Milimani', 'Nakuru Town', 'Kiamunyi', 'Eldoret Town', 'Huruma'
  ];
  
  for (let i = 1; i <= 25; i++) {
    const name = generateKenyanName();
    const county = kenyanCounties[Math.floor(Math.random() * kenyanCounties.length)];
    const city = kenyanCities[Math.floor(Math.random() * kenyanCities.length)];
    
    users.push({
      name,
      email: `customer${i}@kibanda.co.ke`,
      password: await bcrypt.hash('Customer123!', 10),
      phone: `07${Math.floor(Math.random() * 90000000) + 10000000}`,
      role: 'customer',
      address: {
        street: `${Math.floor(Math.random() * 1000) + 1} ${['Street', 'Road', 'Avenue', 'Drive', 'Lane'][Math.floor(Math.random() * 5)]}`,
        city,
        county,
        postalCode: `${Math.floor(Math.random() * 90000) + 10000}`
      },
      isEmailVerified: Math.random() > 0.2, // 80% verified
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
    });
  }
  
  return users;
};

// Generate sample orders with realistic Kenyan data
const generateOrders = (users, products) => {
  const orders = [];
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const statusProbabilities = [0.1, 0.2, 0.3, 0.35, 0.05]; // Probability distribution
  const paymentMethods = ['mpesa', 'card', 'cash_on_delivery'];
  const shippingMethods = ['standard', 'express', 'pickup'];
  const shippingCosts = { standard: 250, express: 500, pickup: 0 };
  
  // Kenyan towns for delivery
  const kenyanTowns = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi',
    'Kitale', 'Kakamega', 'Kisii', 'Meru', 'Nyeri', 'Machakos', 'Kiambu',
    'Naivasha', 'Nanyuki', 'Kericho', 'Bungoma', 'Busia', 'Garissa'
  ];
  
  // Generate orders for each user
  users.forEach(user => {
    // More active users have more orders
    const isActiveUser = Math.random() > 0.7; // 30% are active users
    const orderCount = isActiveUser ? 
      Math.floor(Math.random() * 8) + 3 : // 3-10 orders for active users
      Math.floor(Math.random() * 4) + 1;  // 1-4 orders for regular users
    
    for (let i = 0; i < orderCount; i++) {
      // Generate order items
      const itemCount = Math.floor(Math.random() * 5) + 1; // 1-5 items per order
      const items = [];
      let subtotal = 0;
      
      // Select unique products for this order
      const selectedProducts = [];
      while (selectedProducts.length < itemCount) {
        const product = products[Math.floor(Math.random() * products.length)];
        if (!selectedProducts.includes(product._id.toString())) {
          selectedProducts.push(product._id.toString());
          
          const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
          const effectivePrice = product.discount > 0 ? product.price : product.price;
          
          items.push({
            product: product._id,
            name: product.name,
            price: effectivePrice,
            quantity,
            image: product.images && product.images.length ? product.images[0] : '',
            size: product.sizes && product.sizes.length ? 
              product.sizes[Math.floor(Math.random() * product.sizes.length)] : 'One Size',
            color: product.colors && product.colors.length ? 
              product.colors[Math.floor(Math.random() * product.colors.length)] : 'Black'
          });
          
          subtotal += effectivePrice * quantity;
        }
      }
      
      // Random Kenyan town for delivery
      const deliveryTown = kenyanTowns[Math.floor(Math.random() * kenyanTowns.length)];
      
      // Enhanced address for delivery
      const deliveryAddress = {
        street: `${Math.floor(Math.random() * 500) + 1} ${['Street', 'Road', 'Avenue'][Math.floor(Math.random() * 3)]}`,
        city: deliveryTown,
        county: deliveryTown,
        postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        phone: user.phone,
        additionalInfo: Math.random() > 0.5 ? 'Call before delivery' : ''
      };
      
      // Calculate totals
      const shippingMethod = shippingMethods[Math.floor(Math.random() * shippingMethods.length)];
      const shippingCost = shippingCosts[shippingMethod];
      
      // Free shipping for orders over 5000 KSh
      const finalShippingCost = subtotal > 5000 ? 0 : shippingCost;
      const tax = +(subtotal * 0.16).toFixed(2); // 16% VAT
      const total = +(subtotal + finalShippingCost + tax).toFixed(2);
      
      // Random order date (last 365 days)
      const orderDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
      
      // Determine status with probabilities
      const rand = Math.random();
      let cumulativeProbability = 0;
      let status = 'pending';
      
      for (let j = 0; j < statuses.length; j++) {
        cumulativeProbability += statusProbabilities[j];
        if (rand < cumulativeProbability) {
          status = statuses[j];
          break;
        }
      }
      
      // Generate dates based on status
      let deliveredDate = null;
      let shippedDate = null;
      let processingDate = null;
      
      if (status === 'processing') {
        processingDate = new Date(orderDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);
      } else if (status === 'shipped') {
        processingDate = new Date(orderDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);
        shippedDate = new Date(processingDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
      } else if (status === 'delivered') {
        processingDate = new Date(orderDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);
        shippedDate = new Date(processingDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
        deliveredDate = new Date(shippedDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
      }
      
      // Payment status based on order status
      let paymentStatus = 'pending';
      if (status === 'delivered' || status === 'shipped') {
        paymentStatus = 'completed';
      } else if (status === 'cancelled') {
        paymentStatus = Math.random() > 0.5 ? 'failed' : 'refunded';
      }
      
      // M-Pesa transaction code for Kenyan payments
      let mpesaCode = null;
      if (paymentStatus === 'completed') {
        mpesaCode = `MP${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      }
      
      // Order notes
      const notes = [
        '', 
        'Please deliver before 5 PM',
        'Call upon arrival',
        'Leave with security',
        'Gift wrapping required'
      ][Math.floor(Math.random() * 5)];
      
      orders.push({
        user: user._id,
        items,
        shippingAddress: deliveryAddress,
        billingAddress: user.address,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        paymentStatus,
        paymentDetails: {
          mpesaCode,
          transactionId: paymentStatus === 'completed' ? `TXN${Date.now()}${Math.floor(Math.random() * 1000)}` : null,
          paymentDate: paymentStatus === 'completed' ? new Date(orderDate.getTime() + Math.random() * 2 * 60 * 60 * 1000) : null
        },
        shippingMethod,
        shippingCost: finalShippingCost,
        subtotal: +subtotal.toFixed(2),
        tax,
        total,
        status,
        orderNumber: `KIB${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        trackingNumber: status === 'shipped' || status === 'delivered' ? 
          `KB${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}` : null,
        notes,
        createdAt: orderDate,
        updatedAt: new Date(),
        processedAt: processingDate,
        shippedAt: shippedDate,
        deliveredAt: deliveredDate
      });
    }
  });
  
  return orders;
};

// Main seeding function with progress tracking
const seedDatabase = async () => {
  try {
    console.log('🚀 Starting Kibanda Fashion Database Seeding...\n');
    await connectDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Existing data cleared\n');
    
    // Generate and insert products
    console.log('🛍️  Generating 400+ products...');
    const productsData = generateProducts(400);
    console.log(`📦 Generated ${productsData.length} products`);
    
    const products = await Product.insertMany(productsData);
    console.log(`✅ ${products.length} products inserted into database\n`);
    
    // Generate and insert users
    console.log('👥 Generating users...');
    const usersData = await generateUsers();
    console.log(`👤 Generated ${usersData.length} users`);
    
    const users = await User.insertMany(usersData);
    console.log(`✅ ${users.length} users inserted into database\n`);
    
    // Generate and insert orders
    console.log('📦 Generating orders...');
    const ordersData = generateOrders(users, products);
    console.log(`📊 Generated ${ordersData.length} orders`);
    
    const orders = await Order.insertMany(ordersData);
    console.log(`✅ ${orders.length} orders inserted into database\n`);
    
    // Update users with their orders
    console.log('🔄 Updating users with order references...');
    const updatePromises = orders.map(order => 
      User.findByIdAndUpdate(
        order.user,
        { $push: { orders: order._id } }
      )
    );
    
    await Promise.all(updatePromises);
    console.log('✅ Users updated with order references\n');
    
    // Display comprehensive summary
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!\n');
    console.log('📊 ========== SEEDING SUMMARY ==========');
    console.log(`   Products: ${products.length} items`);
    console.log(`   Users: ${users.length} accounts`);
    console.log(`   Orders: ${orders.length} transactions`);
    console.log('========================================\n');
    
    // Display sample data by category
    console.log('🛍️  SAMPLE PRODUCTS BY CATEGORY:');
    console.log('================================');
    
    const categoriesSample = {};
    products.forEach(product => {
      if (!categoriesSample[product.category]) {
        categoriesSample[product.category] = product;
      }
    });
    
    Object.entries(categoriesSample).forEach(([category, product]) => {
      const priceDisplay = product.discount > 0 ? 
        `KSh ${product.price} (${product.discount}% OFF from KSh ${product.originalPrice})` :
        `KSh ${product.price}`;
      console.log(`   ${category.toUpperCase()}: ${product.name} - ${priceDisplay}`);
    });
    console.log('');
    
    // Display user sample
    console.log('👤 SAMPLE USER ACCOUNTS:');
    console.log('=========================');
    users.slice(0, 3).forEach(user => {
      console.log(`   ${user.name} (${user.email}) - ${user.role.toUpperCase()}`);
      console.log(`     📍 ${user.address.city}, ${user.address.county}`);
      console.log(`     📞 ${user.phone}`);
      console.log('');
    });
    
    // Display order statistics
    console.log('📦 ORDER STATISTICS:');
    console.log('====================');
    const statusCount = {};
    orders.forEach(order => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });
    
    Object.entries(statusCount).forEach(([status, count]) => {
      const percentage = ((count / orders.length) * 100).toFixed(1);
      console.log(`   ${status.toUpperCase()}: ${count} orders (${percentage}%)`);
    });
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    console.log(`\n   💰 Total Revenue: KSh ${totalRevenue.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`);
    console.log(`   📈 Average Order Value: KSh ${(totalRevenue / orders.length).toFixed(2)}`);
    
    // Display login credentials
    console.log('\n🔑 LOGIN CREDENTIALS:');
    console.log('====================');
    console.log('   ADMIN ACCOUNT:');
    console.log('     📧 Email: admin@kibanda.com');
    console.log('     🔐 Password: Admin123!');
    console.log('\n   CUSTOMER ACCOUNTS:');
    console.log('     📧 Email: john@example.com');
    console.log('     🔐 Password: Password123!');
    console.log('     📧 Email: mary@example.com');
    console.log('     🔐 Password: Password123!');
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('==============');
    console.log('   1. Start the backend server: npm run dev');
    console.log('   2. Start the frontend: cd ../frontend && npm start');
    console.log('   3. Visit http://localhost:3000 to view the website');
    console.log('   4. Login with admin credentials to access admin features');
    
    console.log('\n🎯 TIPS:');
    console.log('=======');
    console.log('   • Use "npm run seed:products-only" to refresh only products');
    console.log('   • Use "npm run seed:users-only" to refresh only users');
    console.log('   • Use "npm run seed:orders-only" to refresh only orders');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ SEEDING ERROR:', error);
    console.error('💡 TROUBLESHOOTING:');
    console.error('   • Check if MongoDB is running: mongod');
    console.error('   • Verify MongoDB connection string in .env file');
    console.error('   • Ensure you have sufficient disk space');
    process.exit(1);
  }
};

// Command line options handler
const handleCommandLine = async () => {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    await connectDB();

    switch (command) {
      case '--products-only':
        console.log('🛍️  Seeding only products...');
        await Product.deleteMany({});
        const products = generateProducts(400);
        await Product.insertMany(products);
        console.log(`✅ ${products.length} products inserted`);
        break;

      case '--users-only':
        console.log('👥 Seeding only users...');
        await User.deleteMany({});
        const users = await generateUsers();
        await User.insertMany(users);
        console.log(`✅ ${users.length} users inserted`);
        break;

      case '--orders-only':
        console.log('📦 Seeding only orders...');
        await Order.deleteMany({});
        const existingUsers = await User.find();
        const existingProducts = await Product.find();
        
        if (existingUsers.length === 0 || existingProducts.length === 0) {
          console.error('❌ Need users and products to generate orders');
          console.error('💡 Run: npm run seed first');
          process.exit(1);
        }
        
        const orders = generateOrders(existingUsers, existingProducts);
        await Order.insertMany(orders);
        console.log(`✅ ${orders.length} orders inserted`);
        
        // Update users with orders
        for (const order of orders) {
          await User.findByIdAndUpdate(
            order.user,
            { $push: { orders: order._id } }
          );
        }
        console.log('✅ Users updated with order references');
        break;

      case '--help':
      case '-h':
        console.log('\n🌍 KIBANDA FASHION SEEDER HELP');
        console.log('===============================');
        console.log('Usage: npm run seed [options]');
        console.log('\nOptions:');
        console.log('  (no option)          Seed everything (products, users, orders)');
        console.log('  --products-only      Seed only products');
        console.log('  --users-only         Seed only users');
        console.log('  --orders-only        Seed only orders (requires existing products & users)');
        console.log('  --help, -h           Show this help message');
        console.log('\nExamples:');
        console.log('  npm run seed                    # Seed complete database');
        console.log('  npm run seed --products-only    # Refresh only products');
        console.log('  npm run seed --users-only       # Refresh only users');
        break;

      default:
        // Seed everything
        await seedDatabase();
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Start the seeder
if (require.main === module) {
  handleCommandLine();
}

// Export functions for testing
module.exports = {
  connectDB,
  generateProducts,
  generateUsers,
  generateOrders,
  seedDatabase
};