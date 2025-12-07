import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorContent>
            <ErrorIcon>
              <FaExclamationTriangle />
            </ErrorIcon>
            <ErrorTitle>Something went wrong</ErrorTitle>
            <ErrorMessage>
              We apologize for the inconvenience. An unexpected error has occurred.
            </ErrorMessage>
            
            <ErrorActions>
              <HomeButton to="/">
                <FaHome /> Back to Home
              </HomeButton>
              <RetryButton onClick={this.handleReset}>
                <FaRedo /> Try Again
              </RetryButton>
            </ErrorActions>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <ErrorDetails>
                <h4>Error Details:</h4>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </ErrorDetails>
            )}
          </ErrorContent>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const ErrorContent = styled.div`
  text-align: center;
  max-width: 600px;
  padding: 60px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
`;

const ErrorIcon = styled.div`
  font-size: 80px;
  color: #e74c3c;
  margin-bottom: 30px;
`;

const ErrorTitle = styled.h1`
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 700;
`;

const ErrorMessage = styled.p`
  color: #666;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 40px;
`;

const ErrorActions = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const HomeButton = styled(Link)`
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

const RetryButton = styled.button`
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
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
  }
`;

const ErrorDetails = styled.div`
  margin-top: 40px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: left;
  max-height: 300px;
  overflow-y: auto;

  h4 {
    color: #2c3e50;
    margin-bottom: 10px;
  }

  pre {
    color: #e74c3c;
    font-size: 12px;
    white-space: pre-wrap;
    word-wrap: break-word;
    margin: 10px 0;
  }
`;

export default ErrorBoundary;