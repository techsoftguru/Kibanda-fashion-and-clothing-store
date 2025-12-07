import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaSearch, 
  FaFilter, 
  FaShoppingCart, 
  FaHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaSortAmountDown,
  FaTimes,
  FaTruck,
  FaShieldAlt,
  FaCreditCard
} from 'react-icons/fa';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist } from '../store/slices/userSlice';

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category');
  
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const productsPerPage = 12;

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.user);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProducts = Array.from({ length: 48 }, (_, i) => {
        const categories = ['sneakers', 'clothing', 'accessories', 'traditional'];
        const status = i % 10 === 0 ? 'out_of_stock' : 'in_stock';
        const isFeatured = i % 7 === 0 || i % 11 === 0;
        const rating = 3 + Math.random() * 2; // 3-5 stars
        const reviewCount = Math.floor(Math.random() * 150);
        
        return {
          _id: `product-${i + 1}`,
          name: `Premium ${['African Sneakers', 'Kitenge Shirt', 'Leather Bag', 'Traditional Jewelry', 'Casual Wear', 'Sports Shoes'][i % 6]} ${i + 1}`,
          description: 'High-quality African fashion product with authentic design and materials.',
          category: categories[i % 4],
          price: 500 + Math.floor(Math.random() * 4500),
          originalPrice: 500 + Math.floor(Math.random() * 5500),
          discount: i % 4 === 0 ? 15 : 0,
          stock: status === 'out_of_stock' ? 0 : 10 + (i % 20),
          status,
          featured: isFeatured,
          rating,
          reviewCount,
          sku: `AFS-${(1000 + i).toString().padStart(6, '0')}`,
          createdAt: new Date(Date.now() - i * 86400000).toISOString(),
          images: [
            `https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=${300 + (i % 100)}`,
            `https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=${400 + (i % 100)}`
          ],
          attributes: {
            size: ['S', 'M', 'L', 'XL'],
            color: ['Black', 'Brown', 'Red', 'Blue', 'Green'],
            material: 'Cotton'
          }
        };
      });
      
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } catch (error) {
      toast.error('Failed to load products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let result = [...products];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'featured':
        result.sort((a, b) => (b.featured === a.featured) ? 0 : b.featured ? -1 : 1);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryName = (category) => {
    const categories = {
      'sneakers': 'Sneakers',
      'clothing': 'Clothing',
      'accessories': 'Accessories',
      'traditional': 'Traditional'
    };
    return categories[category] || category;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} color="#f39c12" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" color="#f39c12" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} color="#ddd" />);
    }
    
    return stars;
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    dispatch(addToCart({
      productId: product._id,
      quantity: 1,
      product: product
    }));
    
    toast.success('Added to cart!');
  };

  const handleAddToWishlist = (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    dispatch(addToWishlist(productId));
    toast.success('Added to wishlist!');
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  const getProductStatus = (product) => {
    if (product.stock === 0) return { text: 'Out of Stock', color: '#e74c3c', bg: '#ffebee' };
    if (product.stock < 5) return { text: 'Low Stock', color: '#f39c12', bg: '#fff3cd' };
    if (product.featured) return { text: 'Featured', color: '#9b59b6', bg: '#f3e5f5' };
    if (product.discount > 0) return { text: `${product.discount}% Off`, color: '#27ae60', bg: '#e8f5e9' };
    return { text: 'In Stock', color: '#27ae60', bg: '#e8f5e9' };
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'sneakers', name: 'Sneakers', count: products.filter(p => p.category === 'sneakers').length },
    { id: 'clothing', name: 'Clothing', count: products.filter(p => p.category === 'clothing').length },
    { id: 'accessories', name: 'Accessories', count: products.filter(p => p.category === 'accessories').length },
    { id: 'traditional', name: 'Traditional', count: products.filter(p => p.category === 'traditional').length }
  ];

  if (loading) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  return (
    <>
      <Helmet>
        <title>Products - AfroSneakers | African Fashion & Sneakers</title>
        <meta name="description" content="Browse our collection of premium African fashion, sneakers, clothing, and accessories. Shop authentic African style with secure payment options." />
      </Helmet>

      <ProductsContainer>
        <div className="container">
          {/* Hero Section */}
          <ProductsHero>
            <HeroContent>
              <h1>Discover African Fashion</h1>
              <p>Premium sneakers, clothing, and accessories with authentic African design</p>
              <HeroStats>
                <Stat>
                  <strong>{products.length}+</strong>
                  <span>Products</span>
                </Stat>
                <Stat>
                  <strong>100%</strong>
                  <span>Authentic</span>
                </Stat>
                <Stat>
                  <strong>Free</strong>
                  <span>Delivery in Nairobi</span>
                </Stat>
              </HeroStats>
            </HeroContent>
          </ProductsHero>

          {/* Products Header */}
          <ProductsHeader>
            <div>
              <h2>Our Products</h2>
              <p>Showing {filteredProducts.length} of {products.length} products</p>
            </div>
            
            <HeaderControls>
              <SearchBox>
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <ClearSearch onClick={() => setSearchTerm('')}>
                    <FaTimes />
                  </ClearSearch>
                )}
              </SearchBox>

              <FilterToggle onClick={() => setShowFilters(!showFilters)}>
                <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
              </FilterToggle>
            </HeaderControls>
          </ProductsHeader>

          {/* Main Content */}
          <ProductsContent>
            {/* Filters Sidebar */}
            <FiltersSidebar className={showFilters ? 'show' : ''}>
              <SidebarHeader>
                <h3>Filters</h3>
                <CloseFilters onClick={() => setShowFilters(false)}>
                  <FaTimes />
                </CloseFilters>
              </SidebarHeader>

              {/* Categories */}
              <FilterSection>
                <h4>Categories</h4>
                <CategoryList>
                  {categories.map(category => (
                    <CategoryItem
                      key={category.id}
                      active={selectedCategory === category.id}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span>{category.name}</span>
                      <span className="count">{category.count}</span>
                    </CategoryItem>
                  ))}
                </CategoryList>
              </FilterSection>

              {/* Price Range */}
              <FilterSection>
                <h4>Price Range</h4>
                <PriceRange>
                  <PriceDisplay>
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>to</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </PriceDisplay>
                  <RangeInput
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  />
                  <RangeLabels>
                    <span>0 KES</span>
                    <span>50,000 KES</span>
                  </RangeLabels>
                </PriceRange>
              </FilterSection>

              {/* Sort By */}
              <FilterSection>
                <h4>Sort By</h4>
                <SortOptions>
                  {[
                    { id: 'featured', label: 'Featured' },
                    { id: 'newest', label: 'Newest' },
                    { id: 'price_low', label: 'Price: Low to High' },
                    { id: 'price_high', label: 'Price: High to Low' },
                    { id: 'rating', label: 'Customer Rating' }
                  ].map(option => (
                    <SortOption
                      key={option.id}
                      active={sortBy === option.id}
                      onClick={() => setSortBy(option.id)}
                    >
                      <FaSortAmountDown /> {option.label}
                    </SortOption>
                  ))}
                </SortOptions>
              </FilterSection>

              {/* Features */}
              <FilterSection>
                <h4>Features</h4>
                <FeaturesList>
                  <Feature>
                    <FaTruck /> Free Delivery in Nairobi
                  </Feature>
                  <Feature>
                    <FaShieldAlt /> 30-Day Return Policy
                  </Feature>
                  <Feature>
                    <FaCreditCard /> Secure Payment
                  </Feature>
                </FeaturesList>
              </FilterSection>
            </FiltersSidebar>

            {/* Products Grid */}
            <ProductsGrid>
              {currentProducts.length > 0 ? (
                <>
                  <ProductList>
                    {currentProducts.map((product) => {
                      const status = getProductStatus(product);
                      const inWishlist = isInWishlist(product._id);
                      
                      return (
                        <ProductCard key={product._id}>
                          {/* Product Image */}
                          <ProductImage>
                            <Link to={`/product/${product._id}`}>
                              <img src={product.images[0]} alt={product.name} />
                            </Link>
                            <ProductBadges>
                              {product.featured && (
                                <Badge featured>Featured</Badge>
                              )}
                              {product.discount > 0 && (
                                <Badge discount>-{product.discount}%</Badge>
                              )}
                              <StatusBadge color={status.color} bg={status.bg}>
                                {status.text}
                              </StatusBadge>
                            </ProductBadges>
                            <WishlistButton
                              active={inWishlist}
                              onClick={() => handleAddToWishlist(product._id)}
                            >
                              <FaHeart />
                            </WishlistButton>
                          </ProductImage>

                          {/* Product Info */}
                          <ProductInfo>
                            <CategoryTag>
                              {getCategoryName(product.category)}
                            </CategoryTag>
                            
                            <ProductName>
                              <Link to={`/product/${product._id}`}>
                                {product.name}
                              </Link>
                            </ProductName>
                            
                            <ProductDescription>
                              {product.description.substring(0, 60)}...
                            </ProductDescription>

                            {/* Rating */}
                            <ProductRating>
                              <Stars>
                                {renderStars(product.rating)}
                                <RatingValue>{product.rating.toFixed(1)}</RatingValue>
                              </Stars>
                              <ReviewCount>({product.reviewCount} reviews)</ReviewCount>
                            </ProductRating>

                            {/* Price */}
                            <ProductPrice>
                              {product.discount > 0 ? (
                                <>
                                  <CurrentPrice>{formatPrice(product.price)}</CurrentPrice>
                                  <OriginalPrice>{formatPrice(product.originalPrice)}</OriginalPrice>
                                </>
                              ) : (
                                <CurrentPrice>{formatPrice(product.price)}</CurrentPrice>
                              )}
                            </ProductPrice>

                            {/* Actions */}
                            <ProductActions>
                              <AddToCartButton
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock === 0}
                              >
                                <FaShoppingCart />
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                              </AddToCartButton>
                              <ViewButton to={`/product/${product._id}`}>
                                View Details
                              </ViewButton>
                            </ProductActions>
                          </ProductInfo>
                        </ProductCard>
                      );
                    })}
                  </ProductList>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <PaginationContainer>
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </PaginationContainer>
                  )}
                </>
              ) : (
                <NoProducts>
                  <img src="/assets/images/misc/empty-cart.png" alt="No products" />
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filters</p>
                  <ClearFiltersButton onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPriceRange([0, 50000]);
                    setSortBy('featured');
                  }}>
                    Clear All Filters
                  </ClearFiltersButton>
                </NoProducts>
              )}
            </ProductsGrid>
          </ProductsContent>
        </div>
      </ProductsContainer>
    </>
  );
};

// Styled Components
const ProductsContainer = styled.div`
  padding: 40px 0;
  min-height: 100vh;
  background: #f8f9fa;
`;

const ProductsHero = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 60px 40px;
  margin-bottom: 40px;
  color: white;
  text-align: center;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;

  h1 {
    font-size: 48px;
    margin-bottom: 20px;
    font-weight: 700;
  }

  p {
    font-size: 18px;
    opacity: 0.9;
    margin-bottom: 30px;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 36px;
    }
    p {
      font-size: 16px;
    }
  }
`;

const HeroStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  margin-top: 40px;
`;

const Stat = styled.div`
  text-align: center;

  strong {
    display: block;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 5px;
  }

  span {
    font-size: 14px;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const ProductsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;

  h2 {
    font-size: 32px;
    color: #2c3e50;
    margin-bottom: 10px;
  }

  p {
    color: #666;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 12px 20px;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  min-width: 300px;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  input {
    border: none;
    background: transparent;
    width: 100%;
    font-size: 14px;
    outline: none;

    &::placeholder {
      color: #999;
    }
  }

  svg {
    color: #666;
  }
`;

const ClearSearch = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #e74c3c;
  }
`;

const FilterToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    color: #667eea;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

const ProductsContent = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FiltersSidebar = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  height: fit-content;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);

  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    left: -100%;
    width: 320px;
    height: 100vh;
    z-index: 1000;
    overflow-y: auto;
    transition: left 0.3s ease;
    padding-top: 60px;

    &.show {
      left: 0;
    }
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;

  h3 {
    color: #2c3e50;
    font-size: 20px;
  }
`;

const CloseFilters = styled.button`
  display: none;
  background: none;
  border: none;
  color: #666;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;

  @media (max-width: 1024px) {
    display: block;
  }

  &:hover {
    color: #e74c3c;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 30px;
  padding-bottom: 25px;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  h4 {
    color: #2c3e50;
    font-size: 16px;
    margin-bottom: 15px;
    font-weight: 600;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.active ? '#667eea' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#666'};

  &:hover {
    background: ${props => props.active ? '#5a67d8' : '#e0e0e0'};
  }

  .count {
    font-size: 12px;
    background: ${props => props.active ? 'rgba(255,255,255,0.2)' : '#e0e0e0'};
    padding: 2px 8px;
    border-radius: 10px;
    color: ${props => props.active ? 'white' : '#666'};
  }
`;

const PriceRange = styled.div`
  padding: 10px 0;
`;

const PriceDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;

  span {
    &:nth-child(2) {
      opacity: 0.6;
    }
  }
`;

const RangeInput = styled.input`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #e0e0e0;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  color: #999;
`;

const SortOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SortOption = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.active ? '#667eea' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#666'};

  &:hover {
    background: ${props => props.active ? '#5a67d8' : '#e0e0e0'};
  }

  svg {
    font-size: 14px;
  }
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;

  svg {
    color: #667eea;
    font-size: 16px;
  }
`;

const ProductsGrid = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`;

const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
  }
`;

const ProductImage = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  a {
    display: block;
    height: 100%;
  }
`;

const ProductBadges = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1;
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => props.featured ? `
    background: #9b59b6;
    color: white;
  ` : props.discount ? `
    background: #27ae60;
    color: white;
  ` : `
    background: #3498db;
    color: white;
  `}
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${props => props.bg};
  color: ${props => props.color};
`;

const WishlistButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.active ? '#e74c3c' : '#666'};

  &:hover {
    background: #ffeaea;
    color: #e74c3c;
    transform: scale(1.1);
  }
`;

const ProductInfo = styled.div`
  padding: 20px;
`;

const CategoryTag = styled.span`
  display: inline-block;
  padding: 4px 10px;
  background: #f0f4ff;
  color: #667eea;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const ProductName = styled.h3`
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 600;
  line-height: 1.4;

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #667eea;
    }
  }
`;

const ProductDescription = styled.p`
  color: #666;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 15px;
  min-height: 40px;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
`;

const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RatingValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-left: 5px;
`;

const ReviewCount = styled.span`
  font-size: 12px;
  color: #999;
`;

const ProductPrice = styled.div`
  margin-bottom: 20px;
`;

const CurrentPrice = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
`;

const OriginalPrice = styled.div`
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-top: 2px;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 10px;
`;

const AddToCartButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const ViewButton = styled(Link)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
  }
`;

const PaginationContainer = styled.div`
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e0e0e0;
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 60px 20px;

  img {
    width: 200px;
    margin-bottom: 30px;
    opacity: 0.7;
  }

  h3 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 24px;
  }

  p {
    color: #666;
    margin-bottom: 30px;
    font-size: 16px;
  }
`;

const ClearFiltersButton = styled.button`
  padding: 12px 30px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
`;

export default Products;