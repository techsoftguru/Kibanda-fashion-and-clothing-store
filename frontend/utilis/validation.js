import * as Yup from 'yup';

// Common validation schemas
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const profileSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
    .required('Phone number is required'),
  street: Yup.string().required('Street address is required'),
  city: Yup.string().required('City is required'),
  county: Yup.string().required('County is required'),
  postalCode: Yup.string().required('Postal code is required'),
});

export const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const addressSchema = Yup.object().shape({
  title: Yup.string().required('Address title is required'),
  recipientName: Yup.string().required('Recipient name is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
    .required('Phone number is required'),
  street: Yup.string().required('Street address is required'),
  city: Yup.string().required('City is required'),
  county: Yup.string().required('County is required'),
  postalCode: Yup.string().required('Postal code is required'),
  isDefault: Yup.boolean(),
});

export const checkoutSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
    .required('Phone number is required'),
  street: Yup.string().required('Street address is required'),
  city: Yup.string().required('City is required'),
  county: Yup.string().required('County is required'),
  postalCode: Yup.string().required('Postal code is required'),
});

export const productSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must be less than 100 characters')
    .required('Product name is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .required('Description is required'),
  price: Yup.number()
    .min(0, 'Price must be greater than or equal to 0')
    .required('Price is required'),
  category: Yup.string().required('Category is required'),
  stock: Yup.number()
    .min(0, 'Stock must be greater than or equal to 0')
    .required('Stock is required'),
  discount: Yup.number()
    .min(0, 'Discount must be greater than or equal to 0')
    .max(100, 'Discount cannot exceed 100%'),
  featured: Yup.boolean(),
});

// Validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
    errors: {
      length: password.length >= minLength,
      uppercase: hasUpperCase,
      lowercase: hasLowerCase,
      numbers: hasNumbers
    }
  };
};

export const validatePrice = (price) => {
  if (typeof price !== 'number') {
    price = parseFloat(price);
  }
  
  return !isNaN(price) && price >= 0;
};

export const validateQuantity = (quantity) => {
  if (typeof quantity !== 'number') {
    quantity = parseInt(quantity);
  }
  
  return !isNaN(quantity) && quantity > 0 && Number.isInteger(quantity);
};

export const validateDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Get validation error message
export const getValidationErrorMessage = (error) => {
  if (error.type === 'required') {
    return 'This field is required';
  }
  
  if (error.type === 'min') {
    return `Minimum value is ${error.params.min}`;
  }
  
  if (error.type === 'max') {
    return `Maximum value is ${error.params.max}`;
  }
  
  if (error.type === 'minLength') {
    return `Minimum length is ${error.params.minLength} characters`;
  }
  
  if (error.type === 'maxLength') {
    return `Maximum length is ${error.params.maxLength} characters`;
  }
  
  if (error.type === 'pattern') {
    return 'Invalid format';
  }
  
  if (error.type === 'email') {
    return 'Invalid email address';
  }
  
  return error.message || 'Invalid value';
};

// Format validation errors for display
export const formatValidationErrors = (errors) => {
  const formatted = {};
  
  Object.keys(errors).forEach(key => {
    formatted[key] = getValidationErrorMessage(errors[key]);
  });
  
  return formatted;
};