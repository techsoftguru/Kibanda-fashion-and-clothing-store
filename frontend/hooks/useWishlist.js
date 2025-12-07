import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  addToWishlist, 
  removeFromWishlist,
  getWishlist 
} from '../store/slices/userSlice';

const useWishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { wishlist, loading } = useSelector((state) => state.user);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleAddToWishlist = (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    dispatch(addToWishlist(productId));
    toast.success('Added to wishlist!');
  };

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.info('Removed from wishlist');
  };

  const toggleWishlist = (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      navigate('/login');
      return;
    }

    const isInWishlist = wishlist.some(item => item._id === productId);
    
    if (isInWishlist) {
      handleRemoveFromWishlist(productId);
    } else {
      handleAddToWishlist(productId);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  const clearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      wishlist.forEach(item => {
        dispatch(removeFromWishlist(item._id));
      });
      toast.success('Wishlist cleared');
    }
  };

  const refreshWishlist = () => {
    if (isAuthenticated) {
      dispatch(getWishlist());
    }
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  return {
    wishlist,
    loading,
    addToWishlist: handleAddToWishlist,
    removeFromWishlist: handleRemoveFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    refreshWishlist,
    getWishlistCount,
  };
};

export default useWishlist;