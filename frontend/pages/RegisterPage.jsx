import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { register } from '../store/slices/authSlice';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
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
        'Password must contain at least one uppercase, one lowercase, and one number'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    agreeToTerms: Yup.boolean()
      .oneOf([true], 'You must accept the terms and conditions')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { confirmPassword, agreeToTerms, ...userData } = values;
      const result = await dispatch(register(userData)).unwrap();
      
      if (result) {
        toast.success('Registration successful! Welcome to Kibanda Fashion.');
        navigate('/');
      }
    } catch (error) {
      // Error is handled by Redux
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register - Kibanda Sneakers & Clothing</title>
        <meta name="description" content="Create your Kibanda Fashion account to shop sneakers, clothing, and accessories." />
      </Helmet>

      <RegisterContainer>
        <div className="container">
          <RegisterContent>
            <RegisterFormCard>
              <RegisterHeader>
                <h1>Create Account</h1>
                <p>Join Kibanda Fashion for exclusive deals</p>
              </RegisterHeader>

              <Formik
                initialValues={{ 
                  name: '', 
                  email: '', 
                  phone: '', 
                  password: '', 
                  confirmPassword: '',
                  agreeToTerms: false 
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    {error && (
                      <ErrorMessageDisplay>
                        {error}
                      </ErrorMessageDisplay>
                    )}

                    <FormGroup>
                      <InputIcon>
                        <FaUser />
                      </InputIcon>
                      <Field
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        disabled={loading}
                      />
                      <ErrorMessage name="name" component={ErrorText} />
                    </FormGroup>

                    <FormGrid>
                      <FormGroup>
                        <InputIcon>
                          <FaEnvelope />
                        </InputIcon>
                        <Field
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          disabled={loading}
                        />
                        <ErrorMessage name="email" component={ErrorText} />
                      </FormGroup>

                      <FormGroup>
                        <InputIcon>
                          <FaPhone />
                        </InputIcon>
                        <Field
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          disabled={loading}
                        />
                        <ErrorMessage name="phone" component={ErrorText} />
                      </FormGroup>
                    </FormGrid>

                    <FormGroup>
                      <InputIcon>
                        <FaLock />
                      </InputIcon>
                      <Field
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        disabled={loading}
                      />
                      <PasswordToggle 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </PasswordToggle>
                      <ErrorMessage name="password" component={ErrorText} />
                      <PasswordHint>
                        Must be at least 6 characters with uppercase, lowercase, and number
                      </PasswordHint>
                    </FormGroup>

                    <FormGroup>
                      <InputIcon>
                        <FaLock />
                      </InputIcon>
                      <Field
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        disabled={loading}
                      />
                      <PasswordToggle 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </PasswordToggle>
                      <ErrorMessage name="confirmPassword" component={ErrorText} />
                    </FormGroup>

                    <FormGroup className="checkbox-group">
                      <Field 
                        type="checkbox" 
                        name="agreeToTerms" 
                        id="agreeToTerms" 
                      />
                      <label htmlFor="agreeToTerms">
                        I agree to the <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>
                      </label>
                      <ErrorMessage name="agreeToTerms" component={ErrorText} />
                    </FormGroup>

                    <SubmitButton 
                      type="submit" 
                      disabled={isSubmitting || loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </SubmitButton>

                    <Divider>
                      <span>or</span>
                    </Divider>

                    <SocialRegister>
                      <SocialButton type="button" className="google">
                        Sign up with Google
                      </SocialButton>
                      <SocialButton type="button" className="facebook">
                        Sign up with Facebook
                      </SocialButton>
                    </SocialRegister>
                  </Form>
                )}
              </Formik>

              <RegisterFooter>
                <p>
                  Already have an account?{' '}
                  <Link to="/login">Sign in here</Link>
                </p>
              </RegisterFooter>
            </RegisterFormCard>

            <RegisterBenefits>
              <h2>Why Join Kibanda Fashion?</h2>
              <BenefitsList>
                <Benefit>
                  <BenefitIcon>🎁</BenefitIcon>
                  <div>
                    <h3>Welcome Offer</h3>
                    <p>Get 10% off your first order</p>
                  </div>
                </Benefit>
                <Benefit>
                  <BenefitIcon>🚚</BenefitIcon>
                  <div>
                    <h3>Free Shipping</h3>
                    <p>Free delivery on orders over KSh 3,000</p>
                  </div>
                </Benefit>
                <Benefit>
                  <BenefitIcon>⭐</BenefitIcon>
                  <div>
                    <h3>Loyalty Points</h3>
                    <p>Earn points on every purchase</p>
                  </div>
                </Benefit>
                <Benefit>
                  <BenefitIcon>📱</BenefitIcon>
                  <div>
                    <h3>M-Pesa Integration</h3>
                    <p>Quick and secure payments</p>
                  </div>
                </Benefit>
                <Benefit>
                  <BenefitIcon>🔄</BenefitIcon>
                  <div>
                    <h3>Easy Returns</h3>
                    <p>30-day hassle-free return policy</p>
                  </div>
                </Benefit>
                <Benefit>
                  <BenefitIcon>📧</BenefitIcon>
                  <div>
                    <h3>Exclusive Deals</h3>
                    <p>First access to sales and new arrivals</p>
                  </div>
                </Benefit>
              </BenefitsList>
            </RegisterBenefits>
          </RegisterContent>
        </div>
      </RegisterContainer>
    </>
  );
};

const RegisterContainer = styled.div`
  padding: 80px 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const RegisterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const RegisterFormCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 32px;
    color: #2c3e50;
    margin-bottom: 10px;
    font-weight: 700;
  }

  p {
    color: #666;
    font-size: 16px;
  }
`;

const FormGroup = styled.div`
  position: relative;
  margin-bottom: 25px;

  &.checkbox-group {
    display: flex;
    align-items: center;
    gap: 10px;

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    label {
      color: #666;
      cursor: pointer;
      user-select: none;
      font-size: 14px;
      
      a {
        color: #667eea;
        font-weight: 600;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  font-size: 18px;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 18px;
  transition: color 0.3s ease;

  &:hover {
    color: #667eea;
  }
`;

const PasswordHint = styled.p`
  color: #666;
  font-size: 12px;
  margin: 5px 0 0 45px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ErrorMessageDisplay = styled.div`
  background: #ffeaea;
  color: #e74c3c;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
  margin-left: 45px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 25px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  text-align: center;
  position: relative;
  margin: 30px 0;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e0e0e0;
  }

  span {
    background: white;
    padding: 0 20px;
    color: #666;
    font-size: 14px;
    position: relative;
    z-index: 1;
  }
`;

const SocialRegister = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
`;

const SocialButton = styled.button`
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  color: #333;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &.google {
    &:hover {
      border-color: #db4437;
      color: #db4437;
    }
  }

  &.facebook {
    &:hover {
      border-color: #4267B2;
      color: #4267B2;
    }
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const RegisterFooter = styled.div`
  text-align: center;
  padding-top: 25px;
  border-top: 1px solid #e0e0e0;

  p {
    color: #666;
    font-size: 15px;

    a {
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.3s ease;

      &:hover {
        color: #5a67d8;
        text-decoration: underline;
      }
    }
  }
`;

const RegisterBenefits = styled.div`
  h2 {
    font-size: 28px;
    color: #2c3e50;
    margin-bottom: 30px;
    font-weight: 700;
  }

  @media (max-width: 992px) {
    order: -1;
  }
`;

const BenefitsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`;

const Benefit = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const BenefitIcon = styled.div`
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4ff;
  border-radius: 50%;
`;

const BenefitContent = styled.div`
  h3 {
    color: #2c3e50;
    margin-bottom: 5px;
    font-size: 18px;
  }

  p {
    color: #666;
    font-size: 14px;
    margin: 0;
    line-height: 1.5;
  }
`;

export default RegisterPage;