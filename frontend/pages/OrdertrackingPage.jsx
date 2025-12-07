import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { 
  FaBox, 
  FaCheck, 
  FaTruck, 
  FaHome, 
  FaCreditCard,
  FaPrint,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import Loader from '../components/Loader';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock order data
        const mockOrder = {
          _id: id,
          orderNumber: `ORD-${id.slice(-8).toUpperCase()}`,
          date: new Date().toISOString(),
          status: 'processing',
          items: [
            {
              _id: '1',
              product: {
                name: 'Premium Leather Sneakers',
                images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772'],
                price: 4500
              },
              quantity: 1,
              size: '42',
              color: 'Black'
            },
            {
              _id: '2',
              product: {
                name: 'Casual T-Shirt',
                images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'],
                price: 1500
              },
              quantity: 2,
              size: 'L',
              color: 'White'
            }
          ],
          shippingAddress: {
            street: '123 Main Street',
            city: 'Nairobi',
            county: 'Nairobi',
            postalCode: '00100'
          },
          paymentMethod: 'mpesa',
          paymentStatus: 'paid',
          subtotal: 7500,
          shipping: 0,
          tax: 1200,
          total: 8700,
          tracking: {
            carrier: 'Safaricom Delivery',
            trackingNumber: `TRK-${Date.now().toString(36).toUpperCase()}`,
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        };

        setOrder(mockOrder);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusSteps = (status) => {
    const steps = [
      { key: 'placed', label: 'Order Placed', icon: <FaCreditCard /> },
      { key: 'processing', label: 'Processing', icon: <FaBox /> },
      { key: 'shipped', label: 'Shipped', icon: <FaTruck /> },
      { key: 'delivered', label: 'Delivered', icon: <FaHome /> }
    ];

    const statusIndex = steps.findIndex(step => step.key === status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= statusIndex,
      current: index === statusIndex
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  if (error || !order) {
    return (
      <ErrorContainer>
        <div className="container">
          <ErrorMessage>
            <h3>Order Not Found</h3>
            <p>The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link to="/account" className="btn-primary">
              <FaArrowLeft /> Back to Account
            </Link>
          </ErrorMessage>
        </div>
      </ErrorContainer>
    );
  }

  const statusSteps = getStatusSteps(order.status);

  return (
    <>
      <Helmet>
        <title>Order #{order.orderNumber} - Kibanda Sneakers & Clothing</title>
      </Helmet>

      <OrderContainer>
        <div className="container">
          <OrderHeader>
            <BackLink to="/account">
              <FaArrowLeft /> Back to Orders
            </BackLink>
            <HeaderInfo>
              <h1>Order #{order.orderNumber}</h1>
              <p>Placed on {formatDate(order.date)}</p>
            </HeaderInfo>
            <PrintButton onClick={handlePrint}>
              <FaPrint /> Print Receipt
            </PrintButton>
          </OrderHeader>

          <OrderContent>
            {/* Order Status Tracking */}
            <StatusCard>
              <CardHeader>
                <h2>Order Status</h2>
                <StatusBadge status={order.status}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </StatusBadge>
              </CardHeader>

              <StatusTimeline>
                {statusSteps.map((step, index) => (
                  <TimelineStep key={step.key}>
                    <StepIcon completed={step.completed} current={step.current}>
                      {step.completed ? <FaCheck /> : step.icon}
                    </StepIcon>
                    <StepInfo>
                      <StepLabel>{step.label}</StepLabel>
                      {step.current && (
                        <StepDescription>Your order is currently being processed</StepDescription>
                      )}
                    </StepInfo>
                    {index < statusSteps.length - 1 && (
                      <StepConnector completed={step.completed} />
                    )}
                  </TimelineStep>
                ))}
              </StatusTimeline>
            </StatusCard>

            <OrderDetailsGrid>
              {/* Order Items */}
              <OrderItemsCard>
                <CardHeader>
                  <h2>Order Items</h2>
                  <span>{order.items.length} items</span>
                </CardHeader>

                <ItemsList>
                  {order.items.map((item) => (
                    <OrderItem key={item._id}>
                      <ItemImage src={item.product.images[0]} alt={item.product.name} />
                      <ItemDetails>
                        <h3>{item.product.name}</h3>
                        <ItemAttributes>
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                          <span>Qty: {item.quantity}</span>
                        </ItemAttributes>
                      </ItemDetails>
                      <ItemPrice>
                        {formatPrice(item.product.price * item.quantity)}
                      </ItemPrice>
                    </OrderItem>
                  ))}
                </ItemsList>
              </OrderItemsCard>

              {/* Order Summary */}
              <OrderSummaryCard>
                <CardHeader>
                  <h2>Order Summary</h2>
                </CardHeader>

                <SummaryDetails>
                  <SummaryRow>
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Shipping</span>
                    <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Tax (16% VAT)</span>
                    <span>{formatPrice(order.tax)}</span>
                  </SummaryRow>
                  <SummaryDivider />
                  <SummaryRow className="total">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </SummaryRow>
                </SummaryDetails>

                <PaymentInfo>
                  <h3>Payment Information</h3>
                  <InfoRow>
                    <strong>Method:</strong>
                    <span>{order.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card'}</span>
                  </InfoRow>
                  <InfoRow>
                    <strong>Status:</strong>
                    <StatusBadge status={order.paymentStatus}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </StatusBadge>
                  </InfoRow>
                  <InfoRow>
                    <strong>Date:</strong>
                    <span>{formatDate(order.date)}</span>
                  </InfoRow>
                </PaymentInfo>
              </OrderSummaryCard>

              {/* Shipping Information */}
              <ShippingCard>
                <CardHeader>
                  <h2>Shipping Information</h2>
                </CardHeader>

                <ShippingDetails>
                  <InfoRow>
                    <FaMapMarkerAlt />
                    <div>
                      <strong>Delivery Address</strong>
                      <p>{order.shippingAddress.street}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.county}</p>
                      <p>{order.shippingAddress.postalCode}</p>
                    </div>
                  </InfoRow>

                  <ShippingInfo>
                    <InfoRow>
                      <strong>Carrier:</strong>
                      <span>{order.tracking.carrier}</span>
                    </InfoRow>
                    <InfoRow>
                      <strong>Tracking Number:</strong>
                      <span className="tracking-number">{order.tracking.trackingNumber}</span>
                    </InfoRow>
                    <InfoRow>
                      <strong>Estimated Delivery:</strong>
                      <span>{formatDate(order.tracking.estimatedDelivery)}</span>
                    </InfoRow>
                  </ShippingInfo>
                </ShippingDetails>
              </ShippingCard>

              {/* Customer Support */}
              <SupportCard>
                <CardHeader>
                  <h2>Need Help?</h2>
                </CardHeader>

                <SupportInfo>
                  <InfoRow>
                    <FaPhone />
                    <div>
                      <strong>Call Us</strong>
                      <p>+254 712 345 678</p>
                    </div>
                  </InfoRow>
                  <InfoRow>
                    <FaEnvelope />
                    <div>
                      <strong>Email Us</strong>
                      <p>support@kibanda.co.ke</p>
                    </div>
                  </InfoRow>
                  <ActionButton>
                    Contact Support
                  </ActionButton>
                </SupportInfo>
              </SupportCard>
            </OrderDetailsGrid>
          </OrderContent>
        </div>
      </OrderContainer>
    </>
  );
};

const OrderContainer = styled.div`
  padding: 40px 0 80px;
  min-height: 70vh;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  transition: gap 0.3s ease;

  &:hover {
    gap: 12px;
  }
`;

const HeaderInfo = styled.div`
  h1 {
    font-size: 32px;
    color: #2c3e50;
    margin-bottom: 5px;
  }

  p {
    color: #666;
    font-size: 16px;
  }
`;

const PrintButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-weight: 600;
  color: #333;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    border-color: #667eea;
    color: white;
  }
`;

const OrderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const StatusCard = styled(Card)``;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  h2 {
    color: #2c3e50;
    font-size: 20px;
    margin: 0;
  }

  span {
    color: #666;
    font-size: 14px;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch(props.status) {
      case 'delivered':
        return 'background: #d4edda; color: #155724;';
      case 'shipped':
        return 'background: #cce5ff; color: #004085;';
      case 'processing':
        return 'background: #fff3cd; color: #856404;';
      case 'placed':
        return 'background: #f8f9fa; color: #495057;';
      case 'paid':
        return 'background: #d4edda; color: #155724;';
      case 'pending':
        return 'background: #fff3cd; color: #856404;';
      default:
        return 'background: #f8f9fa; color: #495057;';
    }
  }}
`;

const StatusTimeline = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TimelineStep = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const StepIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  z-index: 2;
  
  ${props => props.completed ? `
    background: #27ae60;
    color: white;
  ` : props.current ? `
    background: #667eea;
    color: white;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
  ` : `
    background: #f8f9fa;
    color: #666;
  `}
`;

const StepConnector = styled.div`
  position: absolute;
  top: 25px;
  left: 25px;
  right: -25px;
  height: 2px;
  background: ${props => props.completed ? '#27ae60' : '#e0e0e0'};
  z-index: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StepInfo = styled.div`
  flex: 1;
`;

const StepLabel = styled.div`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
`;

const StepDescription = styled.div`
  color: #666;
  font-size: 12px;
`;

const OrderDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const OrderItemsCard = styled(Card)`
  grid-column: 1 / -1;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemDetails = styled.div`
  flex: 1;

  h3 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 16px;
  }
`;

const ItemAttributes = styled.div`
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #666;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-size: 18px;
`;

const OrderSummaryCard = styled(Card)``;

const SummaryDetails = styled.div`
  margin-bottom: 30px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
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
  margin: 20px 0;
`;

const PaymentInfo = styled.div`
  h3 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 16px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;

  &:not(:has(strong)) {
    align-items: flex-start;
    gap: 15px;
  }

  strong {
    color: #2c3e50;
  }

  span {
    color: #666;
    
    &.tracking-number {
      font-family: monospace;
      font-weight: 600;
      color: #667eea;
    }
  }
`;

const ShippingCard = styled(Card)``;

const ShippingDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const ShippingInfo = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const SupportCard = styled(Card)``;

const SupportInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 15px;
  background: #667eea;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #5a67d8;
    transform: translateY(-2px);
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
`;

const ErrorContainer = styled.div`
  padding: 80px 0;
`;

const ErrorMessage = styled.div`
  text-align: center;
  max-width: 500px;
  margin: 0 auto;

  h3 {
    color: #2c3e50;
    margin-bottom: 15px;
  }

  p {
    color: #666;
    margin-bottom: 30px;
    line-height: 1.6;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
`;

export default OrderTrackingPage;