import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaPrint,
  FaDownload,
  FaCalendar
} from 'react-icons/fa';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOrders = Array.from({ length: 25 }, (_, i) => {
        const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        const status = statuses[i % 5];
        const paymentMethods = ['mpesa', 'card', 'cash_on_delivery'];
        const paymentMethod = paymentMethods[i % 3];
        
        return {
          _id: `order-${i + 1}`,
          orderNumber: `ORD-${(1000 + i).toString().padStart(6, '0')}`,
          customer: `Customer ${i + 1}`,
          email: `customer${i + 1}@example.com`,
          total: 1500 + (i * 500),
          status,
          paymentMethod,
          paymentStatus: i % 4 === 0 ? 'pending' : 'paid',
          itemsCount: 1 + (i % 3),
          createdAt: new Date(Date.now() - i * 86400000).toISOString(),
          shippingAddress: {
            city: ['Nairobi', 'Mombasa', 'Kisumu'][i % 3],
            street: `Street ${i + 1}`,
          }
        };
      });
      
      setOrders(mockOrders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return '#27ae60';
      case 'shipped': return '#3498db';
      case 'processing': return '#f39c12';
      case 'pending': return '#95a5a6';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <FaCheckCircle />;
      case 'shipped': return <FaTruck />;
      case 'processing': return <FaTruck />;
      case 'pending': return <FaCalendar />;
      case 'cancelled': return <FaTimesCircle />;
      default: return <FaCalendar />;
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'paid' ? '#27ae60' : '#e74c3c';
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const totalRevenue = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);

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
        <title>Orders Management - Admin Dashboard</title>
      </Helmet>

      <OrdersContainer>
        <div className="container">
          <OrdersHeader>
            <div>
              <h1>Orders Management</h1>
              <p>Manage customer orders and track shipments</p>
            </div>
            <StatsSummary>
              <StatCard>
                <StatValue>{orders.length}</StatValue>
                <StatLabel>Total Orders</StatLabel>
              </StatCard>
              <StatCard accent>
                <StatValue>{formatPrice(totalRevenue)}</StatValue>
                <StatLabel>Total Revenue</StatLabel>
              </StatCard>
            </StatsSummary>
          </OrdersHeader>

          <OrdersToolbar>
            <SearchBox>
              <FaSearch />
              <input
                type="text"
                placeholder="Search by order number, customer, or email..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </SearchBox>

            <FilterGroup>
              <FaFilter />
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </FilterGroup>

            <ActionButtons>
              <ExportButton>
                <FaDownload /> Export
              </ExportButton>
            </ActionButtons>
          </OrdersToolbar>

          <OrdersTableContainer>
            <OrdersTable>
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Items</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <OrderNumber>{order.orderNumber}</OrderNumber>
                    </td>
                    <td>
                      <CustomerInfo>
                        <strong>{order.customer}</strong>
                        <small>{order.email}</small>
                      </CustomerInfo>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{formatPrice(order.total)}</td>
                    <td>
                      <StatusBadge color={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </StatusBadge>
                    </td>
                    <td>
                      <PaymentBadge color={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </PaymentBadge>
                      <small>{order.paymentMethod}</small>
                    </td>
                    <td>{order.itemsCount} items</td>
                    <td>
                      <OrderActions>
                        <ActionButton view onClick={() => handleViewOrder(order)}>
                          <FaEye /> View
                        </ActionButton>
                        <StatusSelect 
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </StatusSelect>
                      </OrderActions>
                    </td>
                  </tr>
                ))}
              </tbody>
            </OrdersTable>

            {filteredOrders.length === 0 && (
              <NoOrders>
                <FaTruck size={48} />
                <p>No orders found</p>
                <p>Try adjusting your search or filters</p>
              </NoOrders>
            )}
          </OrdersTableContainer>

          {totalPages > 1 && (
            <Pagination>
              <PaginationButton 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </PaginationButton>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationNumber
                  key={page}
                  active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationNumber>
              ))}
              
              <PaginationButton 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </PaginationButton>
            </Pagination>
          )}
        </div>

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <ModalOverlay onClick={() => setShowOrderModal(false)}>
            <Modal onClick={e => e.stopPropagation()}>
              <ModalHeader>
                <h3>Order Details: {selectedOrder.orderNumber}</h3>
                <CloseButton onClick={() => setShowOrderModal(false)}>×</CloseButton>
              </ModalHeader>
              
              <ModalContent>
                <OrderDetailsGrid>
                  <DetailSection>
                    <h4>Customer Information</h4>
                    <DetailRow>
                      <strong>Name:</strong>
                      <span>{selectedOrder.customer}</span>
                    </DetailRow>
                    <DetailRow>
                      <strong>Email:</strong>
                      <span>{selectedOrder.email}</span>
                    </DetailRow>
                    <DetailRow>
                      <strong>Phone:</strong>
                      <span>+254 712 345 678</span>
                    </DetailRow>
                  </DetailSection>

                  <DetailSection>
                    <h4>Shipping Address</h4>
                    <DetailRow>
                      <strong>Street:</strong>
                      <span>{selectedOrder.shippingAddress.street}</span>
                    </DetailRow>
                    <DetailRow>
                      <strong>City:</strong>
                      <span>{selectedOrder.shippingAddress.city}</span>
                    </DetailRow>
                    <DetailRow>
                      <strong>County:</strong>
                      <span>Nairobi</span>
                    </DetailRow>
                  </DetailSection>

                  <DetailSection>
                    <h4>Order Summary</h4>
                    <DetailRow>
                      <strong>Status:</strong>
                      <StatusBadge color={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status}
                      </StatusBadge>
                    </DetailRow>
                    <DetailRow>
                      <strong>Payment:</strong>
                      <PaymentBadge color={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                        {selectedOrder.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </PaymentBadge>
                    </DetailRow>
                    <DetailRow>
                      <strong>Method:</strong>
                      <span>{selectedOrder.paymentMethod}</span>
                    </DetailRow>
                    <DetailRow>
                      <strong>Total:</strong>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </DetailRow>
                  </DetailSection>
                </OrderDetailsGrid>

                <OrderItems>
                  <h4>Order Items (3 items)</h4>
                  <ItemList>
                    <OrderItem>
                      <span>1 × Premium Sneakers</span>
                      <span>{formatPrice(4500)}</span>
                    </OrderItem>
                    <OrderItem>
                      <span>2 × Casual T-Shirt</span>
                      <span>{formatPrice(3000)}</span>
                    </OrderItem>
                    <OrderItem>
                      <span>1 × Traditional Kitenge</span>
                      <span>{formatPrice(2500)}</span>
                    </OrderItem>
                  </ItemList>
                </OrderItems>
              </ModalContent>

              <ModalActions>
                <ActionButton>
                  <FaPrint /> Print Invoice
                </ActionButton>
                <ActionButton primary>
                  Update Status
                </ActionButton>
              </ModalActions>
            </Modal>
          </ModalOverlay>
        )}
      </OrdersContainer>
    </>
  );
};

const OrdersContainer = styled.div`
  padding: 40px 0;
  min-height: 100vh;
  background: #f8f9fa;
`;

const OrdersHeader = styled.div`
  margin-bottom: 40px;

  h1 {
    font-size: 36px;
    color: #2c3e50;
    margin-bottom: 10px;
  }

  p {
    color: #666;
    font-size: 16px;
    margin-bottom: 30px;
  }
`;

const StatsSummary = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  min-width: 200px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  ${props => props.accent && `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  `}
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${props => props.accent ? 'rgba(255,255,255,0.9)' : '#666'};
`;

const OrdersToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 300px;
  background: #f8f9fa;
  padding: 12px 20px;
  border-radius: 10px;
  border: 2px solid #e0e0e0;

  &:focus-within {
    border-color: #667eea;
  }

  input {
    border: none;
    background: transparent;
    width: 100%;
    font-size: 14px;
    outline: none;

    &::placeholder {
      color: #999;
    }
  }

  svg {
    color: #666;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: #666;
  }

  select {
    padding: 10px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    background: white;
    font-size: 14px;
    cursor: pointer;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #667eea;
      outline: none;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #27ae60;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: #219653;
  }
`;

const OrdersTableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 20px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  th {
    color: #2c3e50;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: #f8f9fa;
  }

  td {
    color: #666;
    font-size: 14px;
  }

  tbody tr:hover {
    background: #f8f9fa;
  }
`;

const OrderNumber = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-family: monospace;
`;

const CustomerInfo = styled.div`
  strong {
    display: block;
    color: #2c3e50;
    margin-bottom: 5px;
  }
  
  small {
    color: #999;
    font-size: 12px;
  }
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.color}20;
  color: ${props => props.color};

  svg {
    font-size: 10px;
  }
`;

const PaymentBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${props => props.color}20;
  color: ${props => props.color};
  margin-right: 5px;
`;

const OrderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;

  ${props => props.view ? `
    background: #e3f2fd;
    color: #1976d2;
    border: 1px solid #bbdefb;

    &:hover {
      background: #bbdefb;
    }
  ` : `
    background: #667eea;
    color: white;
    border: none;

    &:hover {
      background: #5a67d8;
    }
  `}
`;

const StatusSelect = styled.select`
  padding: 6px 10px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 12px;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #667eea;
    outline: none;
  }
`;

const NoOrders = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;

  svg {
    margin-bottom: 20px;
    color: #ddd;
  }

  p {
    margin: 10px 0;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
  flex-wrap: wrap;
`;

const PaginationButton = styled.button`
  padding: 10px 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    border-color: #667eea;
    color: #667eea;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationNumber = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 2px solid ${props => props.active ? '#667eea' : '#e0e0e0'};

  &:hover:not(.active) {
    border-color: #667eea;
    color: #667eea;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  
  h3 {
    color: #2c3e50;
    margin: 0;
    font-size: 20px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #e74c3c;
  }
`;

const ModalContent = styled.div`
  padding: 25px;
`;

const OrderDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
`;

const DetailSection = styled.div`
  h4 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 16px;
    padding-bottom: 10px;
    border-bottom: 2px solid #f0f4ff;
  }
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;

  strong {
    color: #2c3e50;
  }

  span {
    color: #666;
  }
`;

const OrderItems = styled.div`
  h4 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 16px;
  }
`;

const ItemList = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }

  span {
    color: #666;
    font-size: 14px;
  }
`;

const ModalActions = styled.div`
  padding: 20px 25px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
`;

export default AdminOrders;