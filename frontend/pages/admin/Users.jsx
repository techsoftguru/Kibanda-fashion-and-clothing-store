import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { 
  FaSearch, 
  FaFilter, 
  FaUser, 
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaUserShield
} from 'react-icons/fa';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers = Array.from({ length: 25 }, (_, i) => ({
        _id: `user-${i + 1}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        phone: `+254 712 345 ${(i + 100).toString().padStart(3, '0')}`,
        role: i % 5 === 0 ? 'admin' : 'customer',
        status: i % 4 === 0 ? 'inactive' : 'active',
        orders: Math.floor(Math.random() * 50),
        totalSpent: Math.floor(Math.random() * 50000),
        joinedDate: new Date(Date.now() - i * 86400000).toISOString(),
        lastLogin: new Date(Date.now() - (i % 7) * 86400000).toISOString(),
      }));
      
      setUsers(mockUsers);
    } catch (error) {
      toast.error('Failed to load users');
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
    return status === 'active' ? '#27ae60' : '#e74c3c';
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? '#9b59b6' : '#3498db';
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      // Simulate delete
      setUsers(users.filter(u => u._id !== selectedUser._id));
      toast.success('User deleted successfully');
    }
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      ));
      
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalCustomers = users.filter(u => u.role === 'customer').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;

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
        <title>Users Management - Admin Dashboard</title>
      </Helmet>

      <UsersContainer>
        <div className="container">
          <UsersHeader>
            <div>
              <h1>Users Management</h1>
              <p>Manage customer and admin accounts</p>
            </div>
            <UserStats>
              <StatCard>
                <StatValue>{users.length}</StatValue>
                <StatLabel>Total Users</StatLabel>
              </StatCard>
              <StatCard accent>
                <StatValue>{activeUsers}</StatValue>
                <StatLabel>Active Users</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{totalCustomers}</StatValue>
                <StatLabel>Customers</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{totalAdmins}</StatValue>
                <StatLabel>Admins</StatLabel>
              </StatCard>
            </UserStats>
          </UsersHeader>

          <UsersToolbar>
            <SearchBox>
              <FaSearch />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </SearchBox>

            <FilterGroup>
              <FaFilter />
              <select 
                value={selectedRole} 
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </FilterGroup>
          </UsersToolbar>

          <UsersTableContainer>
            <UsersTable>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <UserInfo>
                        <UserAvatar>
                          {user.name.charAt(0).toUpperCase()}
                        </UserAvatar>
                        <div>
                          <UserName>{user.name}</UserName>
                          <UserId>ID: {user._id}</UserId>
                        </div>
                      </UserInfo>
                    </td>
                    <td>
                      <ContactInfo>
                        <div><FaEnvelope /> {user.email}</div>
                        <div><FaPhone /> {user.phone}</div>
                      </ContactInfo>
                    </td>
                    <td>
                      <RoleBadge color={getRoleColor(user.role)}>
                        {user.role === 'admin' ? <FaUserShield /> : <FaUser />}
                        <span>{user.role}</span>
                      </RoleBadge>
                    </td>
                    <td>
                      <StatusBadge color={getStatusColor(user.status)}>
                        {user.status === 'active' ? <FaCheckCircle /> : <FaTimesCircle />}
                        <span>{user.status}</span>
                      </StatusBadge>
                    </td>
                    <td>{user.orders}</td>
                    <td>{formatPrice(user.totalSpent)}</td>
                    <td>
                      <DateInfo>
                        <div>{formatDate(user.joinedDate)}</div>
                        <small>Last: {formatDate(user.lastLogin)}</small>
                      </DateInfo>
                    </td>
                    <td>
                      <ActionButtons>
                        <ActionButton edit title="Edit">
                          <FaEdit />
                        </ActionButton>
                        <ActionButton 
                          status={user.status === 'active' ? 'deactivate' : 'activate'}
                          onClick={() => handleToggleStatus(user._id, user.status)}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </ActionButton>
                        <ActionButton delete onClick={() => handleDeleteUser(user)}>
                          <FaTrash />
                        </ActionButton>
                      </ActionButtons>
                    </td>
                  </tr>
                ))}
              </tbody>
            </UsersTable>

            {filteredUsers.length === 0 && (
              <NoUsers>
                <FaUser size={48} />
                <p>No users found</p>
                <p>Try adjusting your search or filters</p>
              </NoUsers>
            )}
          </UsersTableContainer>

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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedUser && (
          <ModalOverlay>
            <Modal>
              <ModalHeader>
                <h3>Confirm Delete</h3>
              </ModalHeader>
              <ModalContent>
                <p>Are you sure you want to delete user <strong>{selectedUser.name}</strong>?</p>
                <p>This will permanently delete their account and all associated data.</p>
                <WarningMessage>
                  <strong>Warning:</strong> This action cannot be undone!
                </WarningMessage>
              </ModalContent>
              <ModalActions>
                <ModalButton cancel onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </ModalButton>
                <ModalButton delete onClick={confirmDelete}>
                  Delete User
                </ModalButton>
              </ModalActions>
            </Modal>
          </ModalOverlay>
        )}
      </UsersContainer>
    </>
  );
};

const UsersContainer = styled.div`
  padding: 40px 0;
  min-height: 100vh;
  background: #f8f9fa;
`;

const UsersHeader = styled.div`
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

const UserStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
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

const UsersToolbar = styled.div`
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
  gap: 15px;

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

const UsersTableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
`;

const UsersTable = styled.table`
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
`;

const UserName = styled.div`
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 5px;
`;

const UserId = styled.div`
  color: #999;
  font-size: 12px;
  font-family: monospace;
`;

const ContactInfo = styled.div`
  div {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 5px;
    font-size: 13px;
    
    svg {
      color: #666;
      font-size: 12px;
    }
  }
`;

const RoleBadge = styled.div`
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

const DateInfo = styled.div`
  div {
    margin-bottom: 5px;
  }
  
  small {
    color: #999;
    font-size: 11px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;

  ${props => {
    switch(props.title?.toLowerCase()) {
      case 'edit':
        return `
          background: #e8f5e9;
          color: #388e3c;
          border: 1px solid #c8e6c9;

          &:hover {
            background: #c8e6c9;
          }
        `;
      case 'delete':
        return `
          background: #ffebee;
          color: #d32f2f;
          border: 1px solid #ffcdd2;

          &:hover {
            background: #ffcdd2;
          }
        `;
      default:
        return `
          background: ${props.status === 'deactivate' ? '#fff3cd' : '#d4edda'};
          color: ${props.status === 'deactivate' ? '#856404' : '#155724'};
          border: 1px solid ${props.status === 'deactivate' ? '#ffeaa7' : '#c3e6cb'};

          &:hover {
            background: ${props.status === 'deactivate' ? '#ffeaa7' : '#c3e6cb'};
          }
        `;
    }
  }}
`;

const NoUsers = styled.div`
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
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 25px;
  border-bottom: 1px solid #e0e0e0;
  
  h3 {
    color: #2c3e50;
    margin: 0;
    font-size: 20px;
  }
`;

const ModalContent = styled.div`
  padding: 25px;
  
  p {
    color: #666;
    margin-bottom: 15px;
    line-height: 1.6;
  }
`;

const WarningMessage = styled.div`
  padding: 15px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  color: #856404;
  margin-top: 20px;

  strong {
    color: #856404;
  }
`;

const ModalActions = styled.div`
  padding: 20px 25px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
`;

const ModalButton = styled.button`
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.cancel ? `
    background: #f8f9fa;
    color: #666;
    border: 2px solid #e0e0e0;

    &:hover {
      background: #e0e0e0;
    }
  ` : `
    background: #e74c3c;
    color: white;
    border: 2px solid #e74c3c;

    &:hover {
      background: #c0392b;
      border-color: #c0392b;
    }
  `}
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
`;

export default AdminUsers;