import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  FaLock, 
  FaCreditCard, 
  FaMobileAlt, 
  FaMoneyBillWave,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { getCart } from '../store/slices/cartSlice';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);

  const { items, loading, total, subtotal, shipping, tax } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      dispatch(getCart());
    }
  }, [isAuthenticated, items.length, navigate, dispatch]);

  useEffect(() => {
    if (items.length === 0 && !loading) {
      navigate('/cart');
    }
  }, [items, loading, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    street: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'),
    county: Yup.string().required('County is required'),
    postalCode: Yup.string().required('Postal code is required'),
  });

  const initialValues = {
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    county: user?.address?.county || '',
    postalCode: user?.address?.postalCode || '',
    notes: '',
  };

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: <FaMobileAlt />,
      description: 'Pay via M-Pesa. You will receive a payment prompt.',
    },
    {
      id: 'card',
      name: 'Card Payment',
      icon: <FaCreditCard />,
      description: 'Pay with Visa, Mastercard, or other cards.',
    },
    {
      id: 'cash',
      name: 'Cash on Delivery',
      icon: <FaMoneyBillWave />,
      description: 'Pay when you receive your order.',
    },
  ];

  const handlePlaceOrder = async (values) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (paymentMethod === 'mpesa') {
        // Simulate M-Pesa payment
        toast.success('M-Pesa payment initiated. Check your phone for payment prompt.');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Navigate to order confirmation
      navigate('/orders/123456'); // Replace with actual order ID
      toast.success('Order placed successfully!');
      
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = (values) => {
    switch (step) {
      case 1:
        return (
          <FormSection>
            <SectionTitle>
              <FaUser />
              Contact Information
            </SectionTitle>
            
            <FormGrid>
              <FormGroup>
                <label htmlFor="firstName">First Name *</label>
                <Field 
                  type="text" 
                  id="firstName" 
                  name="firstName"
                  placeholder="John"
                />
                <ErrorMessage name="firstName" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="lastName">Last Name *</label>
                <Field 
                  type="text" 
                  id="lastName" 
                  name="lastName"
                  placeholder="Doe"
                />
                <ErrorMessage name="lastName" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="email">Email Address *</label>
                <Field 
                  type="email" 
                  id="email" 
                  name="email"
                  placeholder="john@example.com"
                />
                <ErrorMessage name="email" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="phone">Phone Number *</label>
                <Field 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  placeholder="0712 345 678"
                />
                <ErrorMessage name="phone" component={ErrorText} />
              </FormGroup>
            </FormGrid>
            
            <SectionTitle>
              <FaMapMarkerAlt />
              Shipping Address
            </SectionTitle>
            
            <FormGroup>
              <label htmlFor="street">Street Address *</label>
              <Field 
                type="text" 
                id="street" 
                name="street"
                placeholder="123 Main Street"
              />
              <ErrorMessage name="street" component={ErrorText} />
            </FormGroup>
            
            <FormGrid>
              <FormGroup>
                <label htmlFor="city">City *</label>
                <Field 
                  type="text" 
                  id="city" 
                  name="city"
                  placeholder="Nairobi"
                />
                <ErrorMessage name="city" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="county">County *</label>
                <Field 
                  type="text" 
                  id="county" 
                  name="county"
                  placeholder="Nairobi"
                />
                <ErrorMessage name="county" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="postalCode">Postal Code *</label>
                <Field 
                  type="text" 
                  id="postalCode" 
                  name="postalCode"
                  placeholder="00100"
                />
                <ErrorMessage name="postalCode" component={ErrorText} />
              </FormGroup>
            </FormGrid>
            
            <FormGroup>
              <label htmlFor="notes">Order Notes (Optional)</label>
              <Field 
                as="textarea" 
                id="notes" 
                name="notes"
                placeholder="Any special instructions for delivery..."
                rows="3"
              />
            </FormGroup>
          </FormSection>
        );
        
      case 2:
        return (
          <FormSection>
            <SectionTitle>
              <FaCreditCard />
              Payment Method
            </SectionTitle>
            
            <PaymentMethods>
              {paymentMethods.map((method) => (
                <PaymentMethod
                  key={method.id}
                  active={paymentMethod === method.id}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <PaymentMethodIcon>
                    {method.icon}
                  </PaymentMethodIcon>
                  <PaymentMethodInfo>
                    <h4>{method.name}</h4>
                    <p>{method.description}</p>
                  </PaymentMethodInfo>
                  <PaymentMethodRadio>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                  </PaymentMethodRadio>
                </PaymentMethod>
              ))}
            </PaymentMethods>
            
            {paymentMethod === 'mpesa' && (
              <MpesaInstructions>
                <h4>How to pay with M-Pesa:</h4>
                <ol>
                  <li>Enter your M-Pesa registered phone number</li>
                  <li>You will receive a payment request on your phone</li>
                  <li>Enter your M-Pesa PIN to complete payment</li>
                  <li>Wait for confirmation message</li>
                </ol>
              </MpesaInstructions>
            )}
          </FormSection>
        );
        
      case 3:
        return (
          <FormSection>
            <SectionTitle>
              <FaLock />
              Review & Place Order
            </SectionTitle>
            
            <ReviewSection>
              <ReviewColumn>
                <ReviewItem>
                  <strong>Contact Information:</strong>
                  <p>{values.firstName} {values.lastName}</p>
                  <p>{values.email}</p>
                  <p>{values.phone}</p>
                </ReviewItem>
                
                <ReviewItem>
                  <strong>Shipping Address:</strong>
                  <p>{values.street}</p>
                  <p>{values.city}, {values.county}</p>
                  <p>{values.postalCode}</p>
                </ReviewItem>
                
                <ReviewItem>
                  <strong>Payment Method:</strong>
                  <p>
                    {paymentMethods.find(m => m.id === paymentMethod)?.name}
                  </p>
                </ReviewItem>
              </ReviewColumn>
              
              <ReviewColumn>
                <OrderItems>
                  <strong>Order Items:</strong>
                  {items.map((item) => (
                    <OrderItem key={item._id}>
                      <img src={item.product?.images?.[0]} alt={item.product?.name} />
                      <div>
                        <h5>{item.product?.name}</h5>
                        <p>Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </OrderItem>
                  ))}
                </OrderItems>
              </ReviewColumn>
            </ReviewSection>
            
            <OrderConfirmation>
              <h4>Order Summary</h4>
              <SummaryDetails>
                <SummaryRow>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Tax (16% VAT)</span>
                  <span>{formatPrice(tax)}</span>
                </SummaryRow>
                <SummaryDivider />
                <SummaryRow className="total">
                  <span>Total Amount</span>
                  <span>{formatPrice(total)}</span>
                </SummaryRow>
              </SummaryDetails>
            </OrderConfirmation>
          </FormSection>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Kibanda Sneakers & Clothing</title>
        <meta name="description" content="Complete your purchase securely at Kibanda Fashion." />
      </Helmet>

      <CheckoutContainer>
        <div className="container">
          <CheckoutHeader>
            <BackButton onClick={() => step > 1 ? setStep(step - 1) : navigate('/cart')}>
              <FaArrowLeft /> {step > 1 ? 'Back' : 'Cart'}
            </BackButton>
            <h1>Checkout</h1>
          </CheckoutHeader>

          <CheckoutContent>
            <CheckoutSteps>
              <Step active={step >= 1} completed={step > 1}>
                <StepNumber>1</StepNumber>
                <StepInfo>
                  <StepTitle>Contact & Shipping</StepTitle>
                  <StepDescription>Enter your details</StepDescription>
                </StepInfo>
              </Step>
              
              <Step active={step >= 2} completed={step > 2}>
                <StepNumber>2</StepNumber>
                <StepInfo>
                  <StepTitle>Payment Method</StepTitle>
                  <StepDescription>Choose how to pay</StepDescription>
                </StepInfo>
              </Step>
              
              <Step active={step >= 3} completed={step > 3}>
                <StepNumber>3</StepNumber>
                <StepInfo>
                  <StepTitle>Review & Pay</StepTitle>
                  <StepDescription>Confirm your order</StepDescription>
                </StepInfo>
              </Step>
            </CheckoutSteps>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handlePlaceOrder}
            >
              {({ values, isValid, dirty }) => (
                <Form>
                  {renderStepContent(values)}
                  
                  <CheckoutActions>
                    {step < 3 ? (
                      <NextButton
                        type="button"
                        onClick={() => setStep(step + 1)}
                      >
                        Continue to {step === 1 ? 'Payment' : 'Review'}
                      </NextButton>
                    ) : (
                      <PlaceOrderButton
                        type="submit"
                        disabled={!isValid || !dirty || isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader size="small" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaLock />
                            Place Order & Pay {formatPrice(total)}
                          </>
                        )}
                      </PlaceOrderButton>
                    )}
                    
                    <SecureCheckout>
                      <FaLock />
                      <span>Secure Checkout</span>
                      <small>Your information is protected with 256-bit SSL encryption</small>
                    </SecureCheckout>
                  </CheckoutActions>
                </Form>
              )}
            </Formik>
          </CheckoutContent>
        </div>
      </CheckoutContainer>
    </>
  );
};

const CheckoutContainer = styled.div`
  padding: 40px 0 80px;
  min-height: 70vh;
`;

const CheckoutHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;

  h1 {
    font-size: 36px;
    color: #2c3e50;
    margin: 0;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  font-weight: 600;
  transition: gap 0.3s ease;

  &:hover {
    gap: 12px;
  }
`;

const CheckoutContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CheckoutSteps = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 25px;
    left: 50px;
    right: 50px;
    height: 2px;
    background: #e0e0e0;
    z-index: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    
    &::before {
      display: none;
    }
  }
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  z-index: 2;
  background: white;
  padding: 10px;

  ${props => props.completed && `
    .step-number {
      background: #27ae60;
      color: white;
    }
  `}

  ${props => props.active && !props.completed && `
    .step-number {
      background: #667eea;
      color: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
    }
  `}

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StepNumber = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: #666;
  transition: all 0.3s ease;
`;

const StepInfo = styled.div`
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const StepTitle = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
`;

const StepDescription = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 5px;
`;

const FormSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 18px;

  svg {
    color: #667eea;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    color: #2c3e50;
    font-weight: 500;
    font-size: 14px;
  }

  input, textarea, select {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #667eea;
      outline: none;
    }
  }

  textarea {
    resize: vertical;
  }
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
`;

const PaymentMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
`;

const PaymentMethod = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: ${props => props.active ? '#f0f4ff' : '#f8f9fa'};
  border: 2px solid ${props => props.active ? '#667eea' : '#e0e0e0'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    background: #f0f4ff;
  }
`;

const PaymentMethodIcon = styled.div`
  svg {
    font-size: 32px;
    color: #667eea;
  }
`;

const PaymentMethodInfo = styled.div`
  flex: 1;

  h4 {
    color: #2c3e50;
    margin-bottom: 5px;
    font-size: 16px;
  }

  p {
    color: #666;
    font-size: 12px;
    line-height: 1.5;
    margin: 0;
  }
`;

const PaymentMethodRadio = styled.div`
  input[type="radio"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`;

const MpesaInstructions = styled.div`
  background: #f0f9ff;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;

  h4 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 16px;
  }

  ol {
    margin: 0;
    padding-left: 20px;
    color: #666;

    li {
      margin-bottom: 8px;
      font-size: 14px;
    }
  }
`;

const ReviewSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ReviewColumn = styled.div``;

const ReviewItem = styled.div`
  margin-bottom: 25px;

  strong {
    display: block;
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 16px;
  }

  p {
    color: #666;
    margin: 5px 0;
    font-size: 14px;
  }
`;

const OrderItems = styled.div`
  strong {
    display: block;
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 16px;
  }
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
  }

  div {
    flex: 1;
  }

  h5 {
    color: #2c3e50;
    margin-bottom: 5px;
    font-size: 14px;
  }

  p {
    color: #666;
    font-size: 12px;
    margin: 0;
  }

  span {
    font-weight: 600;
    color: #2c3e50;
    font-size: 14px;
  }
`;

const OrderConfirmation = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;

  h4 {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 18px;
  }
`;

const SummaryDetails = styled.div`
  margin-bottom: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #666;
  font-size: 14px;

  &.total {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin-top: 15px;
  }
`;

const SummaryDivider = styled.div`
  height: 1px;
  background: #e0e0e0;
  margin: 15px 0;
`;

const CheckoutActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const NextButton = styled.button`
  width: 100%;
  max-width: 400px;
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const PlaceOrderButton = styled.button`
  width: 100%;
  max-width: 400px;
  padding: 15px 30px;
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(39, 174, 96, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecureCheckout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 12px;

  svg {
    color: #27ae60;
    font-size: 16px;
  }

  span {
    font-weight: 600;
    color: #2c3e50;
  }

  small {
    text-align: center;
    max-width: 300px;
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
`;

export default CheckoutPage;