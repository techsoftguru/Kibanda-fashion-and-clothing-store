import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaSave,
  FaKey,
  FaShoppingBag,
  FaHistory,
  FaHeart,
  FaSignOutAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { logout } from '../store/slices/authSlice';
import { updateProfile, changePassword } from '../store/slices/userSlice';

const AccountPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('profile');

  const profileValidationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    street: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'),
    county: Yup.string().required('County is required'),
    postalCode: Yup.string().required('Postal code is required'),
  });

  const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and number'
      )
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleProfileSubmit = async (values) => {
    try {
      await dispatch(updateProfile(values)).unwrap();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (values, { resetForm }) => {
    try {
      await dispatch(changePassword(values)).unwrap();
      toast.success('Password changed successfully!');
      resetForm();
    } catch (error) {
      toast.error(error || 'Failed to change password');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
  };

  const renderProfileForm = () => (
    <Formik
      initialValues={{
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        county: user?.address?.county || '',
        postalCode: user?.address?.postalCode || '',
      }}
      validationSchema={profileValidationSchema}
      onSubmit={handleProfileSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <FormGrid>
            <FormGroup>
              <label>
                <FaUser /> Full Name
              </label>
              <Field type="text" name="name" placeholder="Your full name" />
              <ErrorMessage name="name" component={ErrorText} />
            </FormGroup>

            <FormGroup>
              <label>
                <FaEnvelope /> Email Address
              </label>
              <Field type="email" name="email" placeholder="Your email" />
              <ErrorMessage name="email" component={ErrorText} />
            </FormGroup>
          </FormGrid>

          <FormGroup>
            <label>
              <FaPhone /> Phone Number
            </label>
            <Field type="tel" name="phone" placeholder="0712 345 678" />
            <ErrorMessage name="phone" component={ErrorText} />
          </FormGroup>

          <FormGroup>
            <label>
              <FaMapMarkerAlt /> Street Address
            </label>
            <Field type="text" name="street" placeholder="123 Main Street" />
            <ErrorMessage name="street" component={ErrorText} />
          </FormGroup>

          <FormGrid>
            <FormGroup>
              <label>City</label>
              <Field type="text" name="city" placeholder="Nairobi" />
              <ErrorMessage name="city" component={ErrorText} />
            </FormGroup>

            <FormGroup>
              <label>County</label>
              <Field type="text" name="county" placeholder="Nairobi County" />
              <ErrorMessage name="county" component={ErrorText} />
            </FormGroup>

            <FormGroup>
              <label>Postal Code</label>
              <Field type="text" name="postalCode" placeholder="00100" />
              <ErrorMessage name="postalCode" component={ErrorText} />
            </FormGroup>
          </FormGrid>

          <SubmitButton type="submit" disabled={isSubmitting || loading}>
            <FaSave /> Update Profile
          </SubmitButton>
        </Form>
      )}
    </Formik>
  );

  const renderPasswordForm = () => (
    <Formik
      initialValues={{
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }}
      validationSchema={passwordValidationSchema}
      onSubmit={handlePasswordSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <FormGroup>
            <label>Current Password</label>
            <Field 
              type="password" 
              name="currentPassword" 
              placeholder="Enter current password" 
            />
            <ErrorMessage name="currentPassword" component={ErrorText} />
          </FormGroup>

          <FormGroup>
            <label>New Password</label>
            <Field 
              type="password" 
              name="newPassword" 
              placeholder="Enter new password" 
            />
            <ErrorMessage name="newPassword" component={ErrorText} />
          </FormGroup>

          <FormGroup>
            <label>Confirm New Password</label>
            <Field 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm new password" 
            />
            <ErrorMessage name="confirmPassword" component={ErrorText} />
          </FormGroup>

          <SubmitButton type="submit" disabled={isSubmitting || loading}>
            <FaKey /> Change Password
          </SubmitButton>
        </Form>
      )}
    </Formik>
  );

  return (
    <>
      <Helmet>
        <title>My Account - Kibanda Sneakers & Clothing</title>
      </Helmet>

      <AccountContainer>
        <div className="container">
          <AccountHeader>
            <h1>My Account</h1>
            <p>Welcome back, {user?.name?.split(' ')[0] || 'User'}!</p>
          </AccountHeader>

          <AccountLayout>
            <Sidebar>
              <UserCard>
                <Avatar>
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
                <UserInfo>
                  <h3>{user?.name || 'User'}</h3>
                  <p>{user?.email}</p>
                  <p>Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
                </UserInfo>
              </UserCard>

              <NavList>
                <NavItem 
                  active={activeTab === 'profile'} 
                  onClick={() => setActiveTab('profile')}
                >
                  <FaUser />
                  <span>Profile Information</span>
                </NavItem>
                <NavItem 
                  active={activeTab === 'password'} 
                  onClick={() => setActiveTab('password')}
                >
                  <FaKey />
                  <span>Change Password</span>
                </NavItem>
                <NavItem 
                  active={activeTab === 'orders'} 
                  onClick={() => setActiveTab('orders')}
                >
                  <FaShoppingBag />
                  <span>My Orders</span>
                </NavItem>
                <NavItem 
                  active={activeTab === 'wishlist'} 
                  onClick={() => setActiveTab('wishlist')}
                >
                  <FaHeart />
                  <span>Wishlist</span>
                </NavItem>
                <NavItem onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>Logout</span>
                </NavItem>
              </NavList>
            </Sidebar>

            <MainContent>
              {activeTab === 'profile' && (
                <ContentCard>
                  <CardHeader>
                    <h2>
                      <FaUser /> Profile Information
                    </h2>
                  </CardHeader>
                  {renderProfileForm()}
                </ContentCard>
              )}

              {activeTab === 'password' && (
                <ContentCard>
                  <CardHeader>
                    <h2>
                      <FaKey /> Change Password
                    </h2>
                  </CardHeader>
                  {renderPasswordForm()}
                </ContentCard>
              )}

              {activeTab === 'orders' && (
                <ContentCard>
                  <CardHeader>
                    <h2>
                      <FaShoppingBag /> My Orders
                    </h2>
                  </CardHeader>
                  <OrdersList>
                    <p>You haven't placed any orders yet.</p>
                    <ViewOrdersButton to="/shop">
                      Start Shopping
                    </ViewOrdersButton>
                  </OrdersList>
                </ContentCard>
              )}

              {activeTab === 'wishlist' && (
                <ContentCard>
                  <CardHeader>
                    <h2>
                      <FaHeart /> My Wishlist
                    </h2>
                  </CardHeader>
                  <WishlistList>
                    <p>Your wishlist is empty.</p>
                    <ViewWishlistButton to="/shop">
                      Browse Products
                    </ViewWishlistButton>
                  </WishlistList>
                </ContentCard>
              )}
            </MainContent>
          </AccountLayout>
        </div>
      </AccountContainer>
    </>
  );
};

const AccountContainer = styled.div`
  padding: 40px 0 80px;
  min-height: 70vh;
`;

const AccountHeader = styled.div`
  margin-bottom: 40px;

  h1 {
    font-size: 36px;
    color: #2c3e50;
    margin-bottom: 10px;
  }

  p {
    color: #666;
    font-size: 16px;
  }
`;

const AccountLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div``;

const UserCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  text-align: center;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
  color: white;
  margin: 0 auto 20px;
`;

const UserInfo = styled.div`
  h3 {
    color: #2c3e50;
    margin-bottom: 5px;
    font-size: 18px;
  }

  p {
    color: #666;
    font-size: 14px;
    margin: 5px 0;
  }
`;

const NavList = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  background: ${props => props.active ? '#f0f4ff' : 'white'};
  border-left-color: ${props => props.active ? '#667eea' : 'transparent'};

  &:hover {
    background: #f0f4ff;
  }

  svg {
    color: ${props => props.active ? '#667eea' : '#666'};
    font-size: 18px;
  }

  span {
    color: ${props => props.active ? '#667eea' : '#333'};
    font-weight: ${props => props.active ? '600' : '500'};
  }
`;

const MainContent = styled.div``;

const ContentCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const CardHeader = styled.div`
  margin-bottom: 30px;

  h2 {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #2c3e50;
    font-size: 24px;

    svg {
      color: #667eea;
    }
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    color: #2c3e50;
    font-weight: 500;
    font-size: 14px;

    svg {
      color: #667eea;
    }
  }

  input {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #667eea;
      outline: none;
    }
  }
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const OrdersList = styled.div`
  text-align: center;
  padding: 40px;

  p {
    color: #666;
    margin-bottom: 20px;
  }
`;

const ViewOrdersButton = styled.button`
  padding: 12px 30px;
  background: #667eea;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #5a67d8;
    transform: translateY(-2px);
  }
`;

const WishlistList = styled.div`
  text-align: center;
  padding: 40px;

  p {
    color: #666;
    margin-bottom: 20px;
  }
`;

const ViewWishlistButton = styled.button`
  padding: 12px 30px;
  background: #667eea;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #5a67d8;
    transform: translateY(-2px);
  }
`;

export default AccountPage;