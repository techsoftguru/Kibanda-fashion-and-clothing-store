import React from 'react';
import { ToastContainer as BaseToastContainer } from 'react-toastify';

const CustomToastContainer = () => {
  return (
    <BaseToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      style={{
        fontSize: '14px',
        zIndex: 9999,
      }}
    />
  );
};

export default CustomToastContainer;