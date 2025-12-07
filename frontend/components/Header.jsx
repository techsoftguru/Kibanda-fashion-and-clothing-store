import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { 
  FaShoppingCart, 
  FaUser, 
  FaSearch, 
  FaBars, 
  FaTimes,
  FaHeart,
  FaChevronDown
} from 'react-icons/fa';
import { logout } from '../store/slices/authSlice';
import { getCart } from '../store/slices/cartSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [isAuthenticated, dispatch]);

  const categories = [
    { name: 'Sneakers', slug: 'sneakers' },
    { name: 'Men\'s Clothing', slug: 'men' },
    { name: 'Women\'s Clothing', slug: 'women' },
    { name: 'Kids', slug: 'kids' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Traditional', slug: 'traditional' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsDropdownOpen(false);
  };

  return (
    <HeaderContainer>
      <TopBar>
        <div className="container">
          <p>✨ Free delivery on orders over KSh 3,000 | 🇰🇪 Shop Kenyan Fashion!</p>
        </div>
      </TopBar>

      <MainHeader>
        <div className="container">
          <HeaderContent>
            <MenuToggle onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </MenuToggle>

            <Logo>
              <Link to="/">
                <h1>KIBANDA SNEAKERS & CLOTHING</h1>
                <p className="tagline">Authentic Kenyan Fashion</p>
              </Link>
            </Logo>

            <NavMenu className={isMenuOpen ? 'active' : ''}>
              <NavLink to="/">Home</NavLink>
              {categories.map((category) => (
                <NavLink 
                  key={category.slug} 
                  to={`/shop?category=${category.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </NavLink>
              ))}
            </NavMenu>

            <HeaderActions>
              <SearchForm onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search sneakers, clothes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                  <FaSearch />
                </button>
              </SearchForm>

              <ActionIcons>
                {isAuthenticated && (
                  <>
                    <ActionLink to="/wishlist">
                      <FaHeart />
                    </ActionLink>
                    
                    <UserDropdown>
                      <UserButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <FaUser />
                        <FaChevronDown className="chevron" />
                      </UserButton>
                      
                      {isDropdownOpen && (
                        <DropdownMenu>
                          <DropdownItem onClick={() => {
                            navigate('/account');
                            setIsDropdownOpen(false);
                          }}>
                            My Account
                          </DropdownItem>
                          <DropdownItem onClick={() => {
                            navigate('/orders');
                            setIsDropdownOpen(false);
                          }}>
                            My Orders
                          </DropdownItem>
                          {user?.role === 'admin' && (
                            <DropdownItem onClick={() => {
                              navigate('/admin');
                              setIsDropdownOpen(false);
                            }}>
                              Admin Dashboard
                            </DropdownItem>
                          )}
                          <DropdownDivider />
                          <DropdownItem onClick={handleLogout}>
                            Logout
                          </DropdownItem>
                        </DropdownMenu>
                      )}
                    </UserDropdown>
                  </>
                )}
                
                {!isAuthenticated && (
                  <ActionLink to="/login">
                    <FaUser />
                  </ActionLink>
                )}
                
                <CartLink to="/cart">
                  <FaShoppingCart />
                  {totalItems > 0 && (
                    <CartBadge>{totalItems}</CartBadge>
                  )}
                </CartLink>
              </ActionIcons>
            </HeaderActions>
          </HeaderContent>
        </div>
      </MainHeader>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const TopBar = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 0;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  
  p {
    margin: 0;
  }
`;

const MainHeader = styled.div`
  padding: 15px 0;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Logo = styled.div`
  h1 {
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tagline {
    font-size: 12px;
    color: #666;
    margin: 2px 0 0;
    font-weight: 500;
  }

  a {
    text-decoration: none;
  }

  @media (max-width: 768px) {
    flex: 1;
    text-align: center;
    
    h1 {
      font-size: 20px;
    }
  }
`;

const NavMenu = styled.nav`
  display: flex;
  gap: 30px;

  @media (max-width: 768px) {
    position: fixed;
    top: 120px;
    left: -100%;
    width: 100%;
    height: calc(100vh - 120px);
    background: white;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    transition: left 0.3s ease;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);

    &.active {
      left: 0;
    }
  }
`;

const NavLink = styled(Link)`
  color: #333;
  font-weight: 500;
  font-size: 16px;
  padding: 8px 0;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color: #667eea;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    font-size: 18px;
    padding: 15px 0;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
    order: 3;
  }
`;

const SearchForm = styled.form`
  display: flex;
  background: #f8f9fa;
  border-radius: 25px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: #667eea;
  }

  input {
    border: none;
    background: transparent;
    padding: 10px 15px;
    width: 250px;
    outline: none;
    font-size: 14px;

    @media (max-width: 768px) {
      width: 150px;
    }
  }

  button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    padding: 10px 20px;
    cursor: pointer;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.9;
    }
  }
`;

const ActionIcons = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const ActionLink = styled(Link)`
  color: #333;
  font-size: 20px;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color: #667eea;
  }
`;

const CartLink = styled(ActionLink)`
  position: relative;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
`;

const UserDropdown = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #333;
  font-size: 20px;
  transition: color 0.3s ease;

  &:hover {
    color: #667eea;
  }

  .chevron {
    font-size: 12px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  padding: 10px 0;
  margin-top: 10px;
  z-index: 1000;
`;

const DropdownItem = styled.div`
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 14px;
  color: #333;

  &:hover {
    background-color: #f8f9fa;
    color: #667eea;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background-color: #e0e0e0;
  margin: 10px 0;
`;

export default Header;