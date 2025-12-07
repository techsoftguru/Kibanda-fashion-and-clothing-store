import React from 'react';
import styled, { keyframes } from 'styled-components';

const Loader = ({ size = 'medium', fullScreen = false }) => {
  return (
    <LoaderContainer fullScreen={fullScreen}>
      <Spinner size={size}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </Spinner>
    </LoaderContainer>
  );
};

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => props.fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    z-index: 9999;
  `}
`;

const Spinner = styled.div`
  display: inline-block;
  position: relative;
  width: ${props => {
    switch(props.size) {
      case 'small': return '40px';
      case 'large': return '80px';
      default: return '60px';
    }
  }};
  height: ${props => {
    switch(props.size) {
      case 'small': return '40px';
      case 'large': return '80px';
      default: return '60px';
    }
  }};

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 80%;
    height: 80%;
    margin: 8%;
    border: 3px solid;
    border-radius: 50%;
    animation: ${spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #667eea transparent transparent transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }

  div:nth-child(3) {
    animation-delay: -0.15s;
  }
`;

export default Loader;