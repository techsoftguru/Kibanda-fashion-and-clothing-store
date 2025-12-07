import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/userSlice';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.user);

  // Check if product is in wishlist
  React.useEffect(() => {
    const inWishlist = wishlist?.some(item => item._id === product._id);
    setIsWishlisted(inWishlist);
  }, [wishlist, product._id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star-filled" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star-half" />);
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star-empty" />);
    }

    return stars;
  };

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    const cartItem = {
      productId: product._id,
      quantity: 1,
      size: product.sizes?.[0] || 'One Size',
      color: product.colors?.[0] || 'Default',
    };

    dispatch(addToCart(cartItem));
    toast.success('Added to cart!');
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.info('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product._id));
      toast.success('Added to wishlist!');
    }
  };

  const salePrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <CardContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ProductImage>
        <Link to={`/product/${product._id}`}>
          <img src={product.images[0]} alt={product.name} />
          {product.discount > 0 && (
            <DiscountBadge>-{product.discount}%</DiscountBadge>
          )}
          {product.featured && (
            <FeaturedBadge>Featured</FeaturedBadge>
          )}
          {product.stock === 0 && (
            <OutOfStockBadge>Out of Stock</OutOfStockBadge>
          )}
        </Link>
        
        <ProductActions className={isHovered ? 'visible' : ''}>
          <WishlistButton 
            onClick={handleWishlist}
            className={isWishlisted ? 'active' : ''}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FaHeart />
          </WishlistButton>
          <CartButton 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            title="Add to cart"
          >
            <FaShoppingCart />
          </CartButton>
        </ProductActions>
      </ProductImage>

      <ProductInfo>
        <ProductTitle to={`/product/${product._id}`}>
          {product.name}
        </ProductTitle>
        
        <ProductCategory>
          <span>{product.category}</span>
          {product.subcategory && <span> • {product.subcategory}</span>}
        </ProductCategory>

        <ProductRating>
          <div className="stars">
            {renderRating(product.rating)}
          </div>
          <span className="rating-count">({product.reviews?.length || 0})</span>
        </ProductRating>

        <ProductPricing>
          {product.discount > 0 ? (
            <>
              <CurrentPrice>{formatPrice(salePrice)}</CurrentPrice>
              <OriginalPrice>{formatPrice(product.price)}</OriginalPrice>
            </>
          ) : (
            <CurrentPrice>{formatPrice(product.price)}</CurrentPrice>
          )}
        </ProductPricing>

        <ProductStock>
          {product.stock > 0 ? (
            <>
              <StockIndicator inStock />
              <span className="stock-text">
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
              </span>
            </>
          ) : (
            <>
              <StockIndicator />
              <span className="stock-text out">Out of Stock</span>
            </>
          )}
        </ProductStock>
      </ProductInfo>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div`
  position: relative;
  height: 280px;
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
`;

const Badge = styled.span`
  position: absolute;
  top: 12px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  z-index: 2;
`;

const DiscountBadge = styled(Badge)`
  left: 12px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
`;

const FeaturedBadge = styled(Badge)`
  right: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const OutOfStockBadge = styled(Badge)`
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 14px;
`;

const ProductActions = styled.div`
  position: absolute;
  bottom: 15px;
  right: 15px;
  display: flex;
  gap: 10px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ActionButton = styled.button`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover:not(:disabled) {
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WishlistButton = styled(ActionButton)`
  background: white;
  color: #ff4757;

  &.active, &:hover {
    background: #ff4757;
    color: white;
  }
`;

const CartButton = styled(ActionButton)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  }
`;

const ProductInfo = styled.div`
  padding: 20px;
`;

const ProductTitle = styled(Link)`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  display: block;
  line-height: 1.4;
  transition: color 0.3s ease;

  &:hover {
    color: #667eea;
  }
`;

const ProductCategory = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
  text-transform: capitalize;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  .stars {
    display: flex;
    gap: 2px;
  }

  .star-filled {
    color: #ffc107;
  }

  .star-half {
    color: #ffc107;
  }

  .star-empty {
    color: #ddd;
  }

  .rating-count {
    font-size: 12px;
    color: #888;
  }
`;

const ProductPricing = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
`;

const CurrentPrice = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
`;

const OriginalPrice = styled.span`
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
`;

const ProductStock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StockIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.inStock ? '#27ae60' : '#e74c3c'};
`;

export default ProductCard;