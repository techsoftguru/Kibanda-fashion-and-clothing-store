import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { 
  FaShoppingBag, 
  FaUsers, 
  FaMoneyBillWave, 
  FaChartLine,
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalRevenue: 1250000,
          totalOrders: 156,
          totalProducts: 45,
          totalUsers: 89,
          recentOrders: [
            { id: 'ORD-001', customer: 'John Doe', amount: 4500, status: 'delivered', date: '2024-01-15' },
            { id: 'ORD-002', customer: 'Jane Smith', amount: 3200, status: 'processing', date: '2024-01-15' },
            { id: 'ORD-003', customer: 'Mike Johnson', amount: 6700, status: 'shipped', date: '2024-01-14' },
            { id: 'ORD-004', customer: 'Sarah Williams', amount: 2100, status: 'pending', date: '2024-01-14' },
            { id: 'ORD-005', customer: 'David Brown', amount: 8900, status: 'delivered', date: '2024-01-13' },
          ],
          topProducts: [
            { name: 'Leather Sneakers', sales: 45, revenue: 202500 },
            { name: 'Denim Jacket', sales: 32, revenue: 128000 },
            { name: 'Casual T-Shirt', sales: 89, revenue: 133500 },
            { name: 'Traditional Kitenge', sales: 23, revenue: 115000 },
            { name: 'Sports Shoes', sales: 41, revenue: 184500 },
          ]
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return '#27ae60';
      case 'shipped': return '#3498db';
      case 'processing': return '#f39c12';
      case 'pending': return '#95a5a6';
      default: return '#95a5a6';
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
        <title>Admin Dashboard - Kibanda Sneakers & Clothing</title>
      </Helmet>

      <DashboardContainer>
        <div className="container">
          <DashboardHeader>
            <h1>Dashboard</h1>
            <p>Welcome to your admin panel</p>
          </DashboardHeader>

          <StatsGrid>
            <StatCard>
              <StatIcon className="revenue">
                <FaMoneyBillWave />
              </StatIcon>
              <StatInfo>
                <h3>Total Revenue</h3>
                <StatValue>{formatPrice(stats.totalRevenue)}</StatValue>
                <StatChange positive>+12.5% from last month</StatChange>
              </StatInfo>
            </StatCard>

            <StatCard>
              <StatIcon className="orders">
                <FaShoppingBag />
              </StatIcon>
              <StatInfo>
                <h3>Total Orders</h3>
                <StatValue>{stats.totalOrders}</StatValue>
                <StatChange positive>+8.2% from last month</StatChange>
              </StatInfo>
            </StatCard>

            <StatCard>
              <StatIcon className="products">
                <FaBoxOpen />
              </StatIcon>
              <StatInfo>
                <h3>Total Products</h3>
                <StatValue>{stats.totalProducts}</StatValue>
                <StatChange positive>+5 new this week</StatChange>
              </StatInfo>
            </StatCard>

            <StatCard>
              <StatIcon className="users">
                <FaUsers />
              </StatIcon>
              <StatInfo>
                <h3>Total Users</h3>
                <StatValue>{stats.totalUsers}</StatValue>
                <StatChange positive>+15 new this week</StatChange>
              </StatInfo>
            </StatCard>
          </StatsGrid>

          <DashboardContent>
            <MainContent>
              <SectionCard>
                <CardHeader>
                  <h2>Recent Orders</h2>
                  <ViewAllLink to="/admin/orders">View All</ViewAllLink>
                </CardHeader>
                
                <OrdersTable>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{formatPrice(order.amount)}</td>
                        <td>
                          <StatusBadge color={getStatusColor(order.status)}>
                            {order.status}
                          </StatusBadge>
                        </td>
                        <td>{order.date}</td>
                        <td>
                          <ActionButton small>View</ActionButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </OrdersTable>
              </SectionCard>

              <SectionCard>
                <CardHeader>
                  <h2>Top Products</h2>
                  <ViewAllLink to="/admin/products">View All</ViewAllLink>
                </CardHeader>
                
                <ProductsList>
                  {stats.topProducts.map((product, index) => (
                    <ProductItem key={index}>
                      <ProductInfo>
                        <ProductRank>{index + 1}</ProductRank>
                        <ProductName>{product.name}</ProductName>
                      </ProductInfo>
                      <ProductStats>
                        <div>
                          <strong>{product.sales}</strong>
                          <span>Sales</span>
                        </div>
                        <div>
                          <strong>{formatPrice(product.revenue)}</strong>
                          <span>Revenue</span>
                        </div>
                      </ProductStats>
                    </ProductItem>
                  ))}
                </ProductsList>
              </SectionCard>
            </MainContent>

            <Sidebar>
              <SectionCard>
                <CardHeader>
                  <h2>Quick Actions</h2>
                </CardHeader>
                
                <QuickActions>
                  <QuickAction to="/admin/products/new">
                    <FaBoxOpen />
                    <span>Add New Product</span>
                  </QuickAction>
                  <QuickAction to="/admin/orders">
                    <FaShoppingBag />
                    <span>Manage Orders</span>
                  </QuickAction>
                  <QuickAction to="/admin/users">
                    <FaUsers />
                    <span>View Users</span>
                  </QuickAction>
                  <QuickAction to="/admin/analytics">
                    <FaChartLine />
                    <span>View Analytics</span>
                  </QuickAction>
                </QuickActions>
              </SectionCard>

              <SectionCard>
                <CardHeader>
                  <h2>System Status</h2>
                </CardHeader>
                
                <StatusList>
                  <StatusItem>
                    <FaCheckCircle className="success" />
                    <span>API Server</span>
                    <StatusIndicator online />
                  </StatusItem>
                  <StatusItem>
                    <FaCheckCircle className="success" />
                    <span>Database</span>
                    <StatusIndicator online />
                  </StatusItem>
                  <StatusItem>
                    <FaCheckCircle className="success" />
                    <span>Payment Gateway</span>
                    <StatusIndicator online />
                  </StatusItem>
                  <StatusItem>
                    <FaExclamationCircle className="warning" />
                    <span>Email Service</span>
                    <StatusIndicator />
                  </StatusItem>
                </StatusList>
              </SectionCard>
            </Sidebar>
          </DashboardContent>
        </div>
      </DashboardContainer>
    </>
  );
};

const DashboardContainer = styled.div`
  padding: 40px 0;
  min-height: 100vh;
  background: #f8f9fa;
`;

const DashboardHeader = styled.div`
  margin-bottom: 40px;

  h1 {
    font-size: 36px;
    color: #2c3e50;
    margin-bottom: 10px;
  }

  p {
    color: #666;
    font-size: 16px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StatIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;

  &.revenue {
    background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  }

  &.orders {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.products {
    background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%);
  }

  &.users {
    background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  }
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin: 10px 0 5px;
`;

const StatChange = styled.div`
  font-size: 14px;
  color: ${props => props.positive ? '#27ae60' : '#e74c3c'};
`;

const DashboardContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const SectionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;

  h2 {
    color: #2c3e50;
    font-size: 20px;
    margin: 0;
  }
`;

const ViewAllLink = styled(Link)`
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;

  &:hover {
    color: #5a67d8;
    text-decoration: underline;
  }
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  th {
    color: #2c3e50;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    color: #666;
    font-size: 14px;
  }

  tbody tr:hover {
    background: #f8f9fa;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.color}20;
  color: ${props => props.color};
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #666;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    border-color: #667eea;
    color: white;
  }

  ${props => props.small && `
    padding: 4px 8px;
    font-size: 11px;
  `}
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f4ff;
    transform: translateX(5px);
  }
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ProductRank = styled.div`
  width: 30px;
  height: 30px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
`;

const ProductName = styled.div`
  color: #2c3e50;
  font-weight: 600;
`;

const ProductStats = styled.div`
  display: flex;
  gap: 20px;

  div {
    text-align: right;

    strong {
      display: block;
      color: #2c3e50;
      font-size: 16px;
      margin-bottom: 2px;
    }

    span {
      color: #666;
      font-size: 12px;
    }
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const QuickAction = styled(Link)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #2c3e50;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateX(5px);
    
    svg {
      color: white;
    }
  }

  svg {
    color: #667eea;
    font-size: 20px;
  }

  span {
    font-weight: 600;
    font-size: 14px;
  }
`;

const StatusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 0;

  svg {
    font-size: 18px;
    
    &.success {
      color: #27ae60;
    }
    
    &.warning {
      color: #f39c12;
    }
  }

  span {
    flex: 1;
    color: #2c3e50;
    font-size: 14px;
  }
`;

const StatusIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.online ? '#27ae60' : '#95a5a6'};
  box-shadow: 0 0 0 2px ${props => props.online ? '#27ae6020' : '#95a5a620'};
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
`;

export default AdminDashboard;