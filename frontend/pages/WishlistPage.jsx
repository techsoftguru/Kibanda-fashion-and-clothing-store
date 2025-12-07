import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHeart, FaShoppingCart, FaTrash, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { getWishlist, removeFromWishlist } from '../store/slices/userSlice';
import { addToCart } from '../store/slices/cartSlice';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.user);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getWishlist());
    }
  }, [isAuthenticated, dispatch]);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.info('Removed from wishlist');
  };

  const handleMoveToCart = (product) => {
    const cartItem = {
      productId: product._id,
      quantity: 1,
      size: product.sizes?.[0] || 'One Size',
      color: product.colors?.[0] || 'Default',
    };

    dispatch(addToCart(cartItem));
    dispatch(removeFromWishlist(product._id));
    toast.success('Moved to cart!');
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      wishlist.forEach(product => {
        dispatch(removeFromWishlist(product._id));
      });
      toast.success('Wishlist cleared');
    }
  };

  if (!isAuthenticated) {
    return (
      <WishlistContainer>
        <div className="container">
          <EmptyWishlist>
            <FaHeart size={80} />
            <h2>Login Required</h2>
            <p>Please login to view your wishlist.</p>
            <Link to="/login" className="btn-primary">
              Login to Continue
            </Link>
          </EmptyWishlist>
        </div>
      </WishlistContainer>
    );
  }

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
        <title>My Wishlist - Kibanda Sneakers & Clothing</title>
      </Helmet>

      <WishlistContainer>
        <div className="container">
          <WishlistHeader>
            <h1>My Wishlist</h1>
            <p>
              <FaHeart /> {wishlist.length} items saved
            </p>
          </WishlistHeader>

          {wishlist.length === 0 ? (
            <EmptyWishlist>
              <FaHeart size={80} />
              <h2>Your Wishlist is Empty</h2>
              <p>Save items you love for later.</p>
              <Link to="/shop" className="btn-primary">
                Start Shopping <FaArrowRight />
              </Link>
            </EmptyWishlist>
          ) : (
            <>
              <WishlistActions>
                <ActionButton onClick={handleClearWishlist}>
                  Clear All
                </ActionButton>
                <Link to="/shop" className="continue-shopping">
                  Continue Shopping <FaArrowRight />
                </Link>
              </WishlistActions>

              <ProductsGrid>
                {wishlist.map((product) => (
                  <WishlistItem key={product._id}>
                    <ProductCard product={product} />
                    <ItemActions>
                      <ActionButton 
                        onClick={() => handleMoveToCart(product)}
                        className="cart"
                      >
                        <FaShoppingCart /> Move to Cart
                      </ActionButton>
                      <ActionButton 
                        onClick={() => handleRemoveFromWishlist(product._id)}
                        className="remove"
                      >
                        <FaTrash /> Remove
                      </ActionButton>
                    </ItemActions>
                  </WishlistItem>
                ))}
              </ProductsGrid>
            </>
          )}
        </div>
      </WishlistContainer>
    </>
  );
};

const WishlistContainer = styled.div`
  padding: 40px 0 80px;
  min-height: 70vh;
`;

const WishlistHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;

  h1 {
    font-size: 36px;
    color: #2c3e50;
    margin-bottom: 10px;
  }

  p {
    color: #666;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    svg {
      color: #ff4757;
    }
  }
`;

const WishlistActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:not(.cart):not(.remove) {
    background: #ffeaea;
    color: #e74c3c;

    &:hover {
      background: #e74c3c;
      color: white;
    }
  }

  &.cart {
    background: #667eea;
    color: white;

    &:hover {
      background: #5a67d8;
    }
  }

  &.remove {
    background: #f8f9fa;
    color: #666;

    &:hover {
      background: #e0e0e0;
    }
  }
`;

const ContinueShopping = styled(Link)`
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: gap 0.3s ease;

  &:hover {
    gap: 12px;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
`;

const WishlistItem = styled.div`
  position: relative;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
`;

const EmptyWishlist = styled.div`
  text-align: center;
  padding: 80px 20px;

  svg {
    color: #ff4757;
    margin-bottom: 30px;
  }

  h2 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 28px;
  }

  p {
    color: #666;
    margin-bottom: 30px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }
`;

export default WishlistPage;