import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch,
  FaFilter,
  FaUpload,
  FaBoxOpen,
  FaTag,
  FaDollarSign
} from 'react-icons/fa';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProducts = Array.from({ length: 25 }, (_, i) => ({
        _id: `product-${i + 1}`,
        name: `Product ${i + 1}`,
        category: ['sneakers', 'clothing', 'accessories'][i % 3],
        price: 1000 + (i * 500),
        stock: 10 + (i * 2),
        status: i % 4 === 0 ? 'out_of_stock' : 'in_stock',
        featured: i % 5 === 0,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        images: [`https://images.unsplash.com/photo-1549298916-b41d501d3772?ix=100&w=${300 + i}`]
      }));
      
      setProducts(mockProducts);
    } catch (error) {
      toast.error('Failed to load products');
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

  const getCategoryName = (category) => {
    const categories = {
      'sneakers': 'Sneakers',
      'clothing': 'Clothing',
      'accessories': 'Accessories'
    };
    return categories[category] || category;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'in_stock': return '#27ae60';
      case 'out_of_stock': return '#e74c3c';
      case 'low_stock': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      // Simulate delete
      setProducts(products.filter(p => p._id !== selectedProduct._id));
      toast.success('Product deleted successfully');
    }
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

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
        <title>Products Management - Admin Dashboard</title>
      </Helmet>

      <ProductsContainer>
        <div className="container">
          <ProductsHeader>
            <div>
              <h1>Products Management</h1>
              <p>Manage your product catalog</p>
            </div>
            <AddProductButton to="/admin/products/new">
              <FaPlus /> Add New Product
            </AddProductButton>
          </ProductsHeader>

          <ProductsToolbar>
            <SearchBox>
              <FaSearch />
              <input
                type="text"
                placeholder="Search products by name or ID..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </SearchBox>

            <FilterGroup>
              <FaFilter />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="sneakers">Sneakers</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
              </select>
            </FilterGroup>

            <Stats>
              <StatItem>
                <FaBoxOpen />
                <span>Total: {products.length}</span>
              </StatItem>
              <StatItem>
                <FaTag />
                <span>In Stock: {products.filter(p => p.status === 'in_stock').length}</span>
              </StatItem>
            </Stats>
          </ProductsToolbar>

          <ProductsTableContainer>
            <ProductsTable>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <ProductInfo>
                        <ProductImage src={product.images[0]} alt={product.name} />
                        <div>
                          <ProductName>{product.name}</ProductName>
                          <ProductId>ID: {product._id}</ProductId>
                        </div>
                      </ProductInfo>
                    </td>
                    <td>{getCategoryName(product.category)}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <StatusBadge color={getStatusColor(product.status)}>
                        {product.status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                      </StatusBadge>
                    </td>
                    <td>
                      {product.featured ? (
                        <FeaturedBadge>Yes</FeaturedBadge>
                      ) : (
                        <span>No</span>
                      )}
                    </td>
                    <td>{formatDate(product.createdAt)}</td>
                    <td>
                      <ActionButtons>
                        <ActionButton view title="View">
                          <FaEye />
                        </ActionButton>
                        <ActionButton edit title="Edit">
                          <FaEdit />
                        </ActionButton>
                        <ActionButton delete title="Delete" onClick={() => handleDeleteProduct(product)}>
                          <FaTrash />
                        </ActionButton>
                      </ActionButtons>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ProductsTable>

            {filteredProducts.length === 0 && (
              <NoProducts>
                <FaBoxOpen size={48} />
                <p>No products found</p>
                <p>Try adjusting your search or filters</p>
              </NoProducts>
            )}
          </ProductsTableContainer>

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
        {showDeleteModal && selectedProduct && (
          <ModalOverlay>
            <Modal>
              <ModalHeader>
                <h3>Confirm Delete</h3>
              </ModalHeader>
              <ModalContent>
                <p>Are you sure you want to delete <strong>{selectedProduct.name}</strong>?</p>
                <p>This action cannot be undone.</p>
              </ModalContent>
              <ModalActions>
                <ModalButton cancel onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </ModalButton>
                <ModalButton delete onClick={confirmDelete}>
                  Delete Product
                </ModalButton>
              </ModalActions>
            </Modal>
          </ModalOverlay>
        )}
      </ProductsContainer>
    </>
  );
};

const ProductsContainer = styled.div`
  padding: 40px 0;
  min-height: 100vh;
  background: #f8f9fa;
`;

const ProductsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;

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

const AddProductButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const ProductsToolbar = styled.div`
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

const Stats = styled.div`
  display: flex;
  gap: 20px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 8px;

  svg {
    color: #667eea;
  }

  span {
    font-size: 14px;
    color: #666;
    font-weight: 600;
  }
`;

const ProductsTableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
`;

const ProductsTable = styled.table`
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

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ProductName = styled.div`
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 5px;
`;

const ProductId = styled.div`
  color: #999;
  font-size: 12px;
  font-family: monospace;
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

const FeaturedBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: #ffeaa7;
  color: #f39c12;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s ease;
  cursor: pointer;

  ${props => {
    switch(props.title?.toLowerCase()) {
      case 'view':
        return `
          background: #e3f2fd;
          color: #1976d2;
          &:hover { background: #bbdefb; }
        `;
      case 'edit':
        return `
          background: #e8f5e9;
          color: #388e3c;
          &:hover { background: #c8e6c9; }
        `;
      case 'delete':
        return `
          background: #ffebee;
          color: #d32f2f;
          &:hover { background: #ffcdd2; }
        `;
      default:
        return `
          background: #f5f5f5;
          color: #666;
        `;
    }
  }}
`;

const NoProducts = styled.div`
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
    margin-bottom: 10px;
    line-height: 1.6;
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

export default AdminProducts;