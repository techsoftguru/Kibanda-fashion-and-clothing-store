import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  addToCart, 
  removeFromCart, 
  updateCartItem, 
  clearCart 
} from '../store/slices/cartSlice';

const useCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, loading, total, subtotal, shipping, tax, totalItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleAddToCart = (product, quantity = 1, size = null, color = null) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    const cartItem = {
      productId: product._id,
      quantity,
      size: size || product.sizes?.[0] || 'One Size',
      color: color || product.colors?.[0] || 'Default',
    };

    dispatch(addToCart(cartItem));
    toast.success('Added to cart!');
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.info('Item removed from cart');
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    dispatch(updateCartItem({ itemId, quantity: newQuantity }));
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

  const getCartItem = (productId) => {
    return items.find(item => item.product?._id === productId);
  };

  const isInCart = (productId) => {
    return items.some(item => item.product?._id === productId);
  };

  return {
    items,
    loading,
    total,
    subtotal,
    shipping,
    tax,
    totalItems,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    checkout: handleCheckout,
    getCartItem,
    isInCart,
  };
};

export default useCart;