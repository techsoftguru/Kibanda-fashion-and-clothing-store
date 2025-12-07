import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout, loadUser } from '../store/slices/authSlice';
import { useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated, loading]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success('Logged out successfully');
  };

  const checkAuth = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
      return false;
    }
    return true;
  };

  const checkAdmin = () => {
    if (!checkAuth()) return false;
    if (user?.role !== 'admin') {
      toast.error('Admin access required');
      navigate('/');
      return false;
    }
    return true;
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    logout: handleLogout,
    checkAuth,
    checkAdmin,
  };
};