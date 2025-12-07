import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f9f9f9;
    color: #333;
    line-height: 1.6;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .section-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 2rem;
    color: #2c3e50;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
    }
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 28px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
    outline: none;
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }
  }

  .btn-secondary {
    background: #fff;
    color: #667eea;
    border: 2px solid #667eea;
    
    &:hover:not(:disabled) {
      background: #667eea;
      color: white;
    }
  }

  .btn-outline {
    background: transparent;
    color: #2c3e50;
    border: 2px solid #e0e0e0;
    
    &:hover:not(:disabled) {
      border-color: #667eea;
      color: #667eea;
    }
  }

  .text-center {
    text-align: center;
  }

  .mt-1 { margin-top: 0.5rem; }
  .mt-2 { margin-top: 1rem; }
  .mt-3 { margin-top: 1.5rem; }
  .mt-4 { margin-top: 2rem; }
  .mt-5 { margin-top: 3rem; }

  .mb-1 { margin-bottom: 0.5rem; }
  .mb-2 { margin-bottom: 1rem; }
  .mb-3 { margin-bottom: 1.5rem; }
  .mb-4 { margin-bottom: 2rem; }
  .mb-5 { margin-bottom: 3rem; }

  .py-1 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  .py-2 { padding-top: 1rem; padding-bottom: 1rem; }
  .py-3 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
  .py-4 { padding-top: 2rem; padding-bottom: 2rem; }
  .py-5 { padding-top: 3rem; padding-bottom: 3rem; }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    font-size: 18px;
    color: #666;
  }

  .error {
    color: #e74c3c;
    text-align: center;
    padding: 20px;
    background: #ffeaea;
    border-radius: 8px;
    margin: 20px 0;
  }

  .success {
    color: #27ae60;
    text-align: center;
    padding: 20px;
    background: #eafaf1;
    border-radius: 8px;
    margin: 20px 0;
  }

  @media (max-width: 768px) {
    .section-title {
      font-size: 2rem;
    }
    
    .container {
      padding: 0 15px;
    }
  }
`;