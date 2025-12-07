import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { FaHome, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Kibanda Sneakers & Clothing</title>
      </Helmet>

      <NotFoundContainer>
        <div className="container">
          <NotFoundContent>
            <NotFoundIcon>404</NotFoundIcon>
            <NotFoundTitle>Page Not Found</NotFoundTitle>
            <NotFoundMessage>
              Oops! The page you're looking for doesn't exist or has been moved.
            </NotFoundMessage>
            
            <NotFoundActions>
              <HomeLink to="/">
                <FaHome /> Back to Home
              </HomeLink>
              <ShopLink to="/shop">
                <FaShoppingBag /> Continue Shopping
              </ShopLink>
            </NotFoundActions>
          </NotFoundContent>
        </div>
      </NotFoundContainer>
    </>
  );
};

const NotFoundContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 80px 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const NotFoundContent = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 60px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
`;

const NotFoundIcon = styled.div`
  font-size: 120px;
  font-weight: 900;
  color: #667eea;
  line-height: 1;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NotFoundTitle = styled.h1`
  font-size: 36px;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 700;
`;

const NotFoundMessage = styled.p`
  color: #666;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 40px;
`;

const NotFoundActions = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const ShopLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
  }
`;

export default NotFoundPage;