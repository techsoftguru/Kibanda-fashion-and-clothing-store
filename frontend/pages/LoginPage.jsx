import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { login } from '../store/slices/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/';

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await dispatch(login(values)).unwrap();
      
      if (result) {
        toast.success('Login successful!');
        navigate(from, { replace: true });
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
        <title>Login - Kibanda Sneakers & Clothing</title>
        <meta name="description" content="Login to your Kibanda Fashion account to shop sneakers, clothing, and accessories." />
      </Helmet>

      <LoginContainer>
        <div className="container">
          <LoginContent>
            <LoginFormCard>
              <LoginHeader>
                <h1>Welcome Back</h1>
                <p>Sign in to your Kibanda account</p>
              </LoginHeader>

              <Formik
                initialValues={{ email: '', password: '' }}
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
                    </FormGroup>

                    <FormOptions>
                      <RememberMe>
                        <Field type="checkbox" name="remember" id="remember" />
                        <label htmlFor="remember">Remember me</label>
                      </RememberMe>
                      <ForgotPassword to="/forgot-password">
                        Forgot Password?
                      </ForgotPassword>
                    </FormOptions>

                    <SubmitButton 
                      type="submit" 
                      disabled={isSubmitting || loading}
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </SubmitButton>

                    <Divider>
                      <span>or</span>
                    </Divider>

                    <SocialLogin>
                      <SocialButton type="button" className="google">
                        Continue with Google
                      </SocialButton>
                      <SocialButton type="button" className="facebook">
                        Continue with Facebook
                      </SocialButton>
                    </SocialLogin>
                  </Form>
                )}
              </Formik>

              <LoginFooter>
                <p>
                  Don't have an account?{' '}
                  <Link to="/register">Sign up here</Link>
                </p>
              </LoginFooter>
            </LoginFormCard>

            <LoginBenefits>
              <h2>Benefits of having an account:</h2>
              <BenefitsList>
                <Benefit>
                  <h3>🛒 Faster Checkout</h3>
                  <p>Save your shipping details for quick purchases</p>
                </Benefit>
                <Benefit>
                  <h3>❤️ Wishlist</h3>
                  <p>Save your favorite items for later</p>
                </Benefit>
                <Benefit>
                  <h3>📦 Order Tracking</h3>
                  <p>Track your orders in real-time</p>
                </Benefit>
                <Benefit>
                  <h3>🎁 Exclusive Offers</h3>
                  <p>Get special discounts and early access to sales</p>
                </Benefit>
              </BenefitsList>
            </LoginBenefits>
          </LoginContent>
        </div>
      </LoginContainer>
    </>
  );
};

const LoginContainer = styled.div`
  padding: 80px 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const LoginContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const LoginFormCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const LoginHeader = styled.div`
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

const FormOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  font-size: 14px;
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  label {
    color: #666;
    cursor: pointer;
    user-select: none;
  }
`;

const ForgotPassword = styled(Link)`
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #5a67d8;
    text-decoration: underline;
  }
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

const SocialLogin = styled.div`
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

const LoginFooter = styled.div`
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

const LoginBenefits = styled.div`
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
  gap: 25px;
`;

const Benefit = styled.div`
  h3 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  p {
    color: #666;
    font-size: 15px;
    line-height: 1.6;
    margin: 0;
  }
`;

export default LoginPage;