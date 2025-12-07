import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaArrowLeft, 
  FaLock,
  FaShoppingCart
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { 
  getCart, 
  removeFromCart, 
  updateCartItem,
  clearCart 
} from '../store/slices/cartSlice';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, total, subtotal, shipping, tax, totalItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [isAuthenticated, dispatch]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('Are you sure you want to remove this item from cart?')) {
      dispatch(removeFromCart(itemId));
      toast.success('Item removed from cart');
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      toast.success('Cart cleared');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed to checkout');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    navigate('/checkout');
  };

  if (loading) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  if (!isAuthenticated) {
    return (
      <CartContainer>
        <div className="container">
          <EmptyCart>
            <FaShoppingCart size={80} />
            <h2>Please Login</h2>
            <p>You need to be logged in to view your cart.</p>
            <div className="buttons">
              <Link to="/login" className="btn-primary">
                Login to Continue
              </Link>
              <Link to="/shop" className="btn-secondary">
                Continue Shopping
              </Link>
            </div>
          </EmptyCart>
        </div>
      </CartContainer>
    );
  }

  if (items.length === 0) {
    return (
      <CartContainer>
        <div className="container">
          <EmptyCart>
            <FaShoppingCart size={80} />
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/shop" className="btn-primary">
              Continue Shopping
            </Link>
          </EmptyCart>
        </div>
      </CartContainer>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart - Kibanda Sneakers & Clothing</title>
        <meta name="description" content="Review your shopping cart items and proceed to checkout at Kibanda Fashion." />
      </Helmet>

      <CartContainer>
        <div className="container">
          <CartHeader>
            <h1>Shopping Cart</h1>
            <p className="item-count">{totalItems} items in cart</p>
          </CartHeader>

          <CartContent>
            <CartItems>
              <CartHeaderRow>
                <HeaderProduct>Product</HeaderProduct>
                <HeaderPrice>Price</HeaderPrice>
                <HeaderQuantity>Quantity</HeaderQuantity>
                <HeaderTotal>Total</HeaderTotal>
                <HeaderActions>Actions</HeaderActions>
              </CartHeaderRow>

              {items.map((item) => (
                <CartItem key={item._id}>
                  <ItemProduct>
                    <ItemImage src={item.product?.images?.[0]} alt={item.product?.name} />
                    <ItemDetails>
                      <h3>{item.product?.name}</h3>
                      <ItemAttributes>
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </ItemAttributes>
                      {item.product?.stock && (
                        <StockStatus inStock={item.product.stock > 0}>
                          {item.product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </StockStatus>
                      )}
                    </ItemDetails>
                  </ItemProduct>

                  <ItemPrice>
                    {formatPrice(item.price)}
                  </ItemPrice>

                  <ItemQuantity>
                    <QuantityControl>
                      <button 
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                        min="1"
                        max={item.product?.stock || 10}
                      />
                      <button 
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        disabled={item.quantity >= (item.product?.stock || 10)}
                      >
                        <FaPlus />
                      </button>
                    </QuantityControl>
                  </ItemQuantity>

                  <ItemTotal>
                    {formatPrice(item.price * item.quantity)}
                  </ItemTotal>

                  <ItemActions>
                    <RemoveButton onClick={() => handleRemoveItem(item._id)}>
                      <FaTrash />
                    </RemoveButton>
                  </ItemActions>
                </CartItem>
              ))}

              <CartActions>
                <Link to="/shop" className="continue-shopping">
                  <FaArrowLeft /> Continue Shopping
                </Link>
                <ClearCartButton onClick={handleClearCart}>
                  Clear Cart
                </ClearCartButton>
              </CartActions>
            </CartItems>

            <CartSummary>
              <SummaryHeader>
                <h3>Order Summary</h3>
              </SummaryHeader>

              <SummaryDetails>
                <SummaryRow>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </SummaryRow>
                
                <SummaryRow>
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    {subtotal < 3000 && (
                      <small>Free shipping on orders over KSh 3,000</small>
                    )}
                  </span>
                </SummaryRow>
                
                <SummaryRow>
                  <span>Tax (16% VAT)</span>
                  <span>{formatPrice(tax)}</span>
                </SummaryRow>
                
                <SummaryDivider />
                
                <SummaryRow className="total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </SummaryRow>
              </SummaryDetails>

              <SummaryActions>
                <CheckoutButton onClick={handleCheckout}>
                  <FaLock />
                  Proceed to Checkout
                </CheckoutButton>
                
                <PaymentMethods>
                  <p>Secure checkout with:</p>
                  <PaymentIcons>
                    <span>M-Pesa</span>
                    <span>Visa</span>
                    <span>Mastercard</span>
                  </PaymentIcons>
                </PaymentMethods>
              </SummaryActions>
            </CartSummary>
          </CartContent>
        </div>
      </CartContainer>
    </>
  );
};

const CartContainer = styled.div`
  padding: 40px 0 80px;
  min-height: 70vh;
`;

const CartHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;

  h1 {
    font-size: 36px;
    color: #2c3e50;
    margin-bottom: 10px;
  }

  .item-count {
    color: #666;
    font-size: 16px;
  }
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`;

const CartHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr;
  padding: 20px;
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e0e0e0;
  font-size: 14px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const HeaderProduct = styled.div``;
const HeaderPrice = styled.div``;
const HeaderQuantity = styled.div``;
const HeaderTotal = styled.div``;
const HeaderActions = styled.div``;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr;
  padding: 20px;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f9f9f9;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
    position: relative;
    padding-bottom: 60px;
  }
`;

const ItemProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
`;

const ItemDetails = styled.div`
  h3 {
    font-size: 16px;
    color: #2c3e50;
    margin-bottom: 8px;
    line-height: 1.4;
  }
`;

const ItemAttributes = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 5px;
  font-size: 12px;
  color: #666;
`;

const StockStatus = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.inStock ? '#27ae60' : '#e74c3c'};
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;

  @media (max-width: 768px) {
    &::before {
      content: 'Price: ';
      font-weight: normal;
      color: #666;
      margin-right: 10px;
    }
  }
`;

const ItemQuantity = styled.div`
  @media (max-width: 768px) {
    &::before {
      content: 'Quantity: ';
      font-weight: normal;
      color: #666;
      margin-right: 10px;
    }
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 120px;

  button {
    width: 35px;
    height: 35px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 8px;
    font-size: 12px;
    color: #333;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      background: #667eea;
      border-color: #667eea;
      color: white;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  input {
    width: 50px;
    height: 35px;
    border: 2px solid #e0e0e0;
    text-align: center;
    font-size: 14px;
    border-radius: 8px;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    max-width: none;
    justify-content: center;
  }
`;

const ItemTotal = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-size: 18px;

  @media (max-width: 768px) {
    &::before {
      content: 'Total: ';
      font-weight: normal;
      color: #666;
      margin-right: 10px;
    }
  }
`;

const ItemActions = styled.div`
  @media (max-width: 768px) {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
`;

const RemoveButton = styled.button`
  color: #e74c3c;
  font-size: 18px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const CartActions = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e0e0e0;

  .continue-shopping {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #667eea;
    font-weight: 600;
    transition: gap 0.3s ease;

    &:hover {
      gap: 12px;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ClearCartButton = styled.button`
  padding: 10px 20px;
  background: #ffeaea;
  color: #e74c3c;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #e74c3c;
    color: white;
  }
`;

const CartSummary = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 120px;
`;

const SummaryHeader = styled.div`
  margin-bottom: 30px;

  h3 {
    color: #2c3e50;
    font-size: 20px;
    margin: 0;
    position: relative;
    padding-bottom: 10px;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 3px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
    }
  }
`;

const SummaryDetails = styled.div`
  margin-bottom: 30px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;

  small {
    display: block;
    font-size: 12px;
    color: #999;
    margin-top: 5px;
  }

  &.total {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin-top: 15px;
  }
`;

const SummaryDivider = styled.div`
  height: 1px;
  background: #e0e0e0;
  margin: 20px 0;
`;

const SummaryActions = styled.div``;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const PaymentMethods = styled.div`
  text-align: center;

  p {
    color: #666;
    font-size: 12px;
    margin-bottom: 10px;
  }
`;

const PaymentIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;

  span {
    background: #f8f9fa;
    padding: 5px 12px;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 600;
    color: #666;
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 80px 20px;

  svg {
    color: #ddd;
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

  .buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-primary, .btn-secondary {
    min-width: 200px;
  }
`;

export default CartPage;