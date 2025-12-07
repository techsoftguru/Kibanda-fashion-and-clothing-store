import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaChevronRight } from 'react-icons/fa';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const getBreadcrumbName = (path) => {
    const names = {
      '': 'Home',
      'shop': 'Shop',
      'product': 'Product',
      'cart': 'Shopping Cart',
      'checkout': 'Checkout',
      'login': 'Login',
      'register': 'Register',
      'account': 'My Account',
      'wishlist': 'Wishlist',
      'orders': 'My Orders',
      'admin': 'Admin Dashboard',
      'products': 'Products',
      'users': 'Users',
    };
    return names[path] || path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <BreadcrumbContainer>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink to="/">
            <FaHome />
          </BreadcrumbLink>
          {pathnames.length > 0 && <FaChevronRight className="separator" />}
        </BreadcrumbItem>

        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <BreadcrumbItem key={routeTo}>
              {isLast ? (
                <BreadcrumbCurrent>{getBreadcrumbName(name)}</BreadcrumbCurrent>
              ) : (
                <BreadcrumbLink to={routeTo}>
                  {getBreadcrumbName(name)}
                </BreadcrumbLink>
              )}
              {!isLast && <FaChevronRight className="separator" />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbContainer>
  );
};

const BreadcrumbContainer = styled.nav`
  padding: 20px 0;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
`;

const BreadcrumbList = styled.ol`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
`;

const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;

  .separator {
    margin: 0 10px;
    color: #999;
    font-size: 10px;
  }
`;

const BreadcrumbLink = styled(Link)`
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    color: #5a67d8;
    text-decoration: underline;
  }
`;

const BreadcrumbCurrent = styled.span`
  color: #666;
  font-weight: 600;
`;

export default Breadcrumb;