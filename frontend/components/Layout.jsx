import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import Loader from './Loader';
import { useSelector } from 'react-redux';

const Layout = ({ children }) => {
  const { loading } = useSelector((state) => state.auth);

  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        {loading ? <Loader /> : children}
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Account for fixed header */
`;

export default Layout;