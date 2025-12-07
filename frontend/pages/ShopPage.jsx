import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { 
  FaFilter, 
  FaTimes, 
  FaSortAmountDown, 
  FaSortAmountUp,
  FaStar
} from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { 
  fetchProducts, 
  fetchCategories, 
  setFilters, 
  clearFilters 
} from '../store/slices/productSlice';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  
  const dispatch = useDispatch();
  const { 
    products, 
    categories, 
    loading, 
    error, 
    totalPages, 
    currentPage, 
    totalProducts,
    filters 
  } = useSelector((state) => state.products);

  // Get filters from URL
  useEffect(() => {
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');

    setSelectedCategory(category);
    setSelectedSort(sortBy);
    
    dispatch(setFilters({ category, search, minPrice, maxPrice, sortBy }));
    
    dispatch(fetchProducts({
      page,
      limit: 12,
      filters: { category, search, minPrice, maxPrice, sortBy }
    }));
  }, [searchParams, dispatch]);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const sortOptions = [
    { value: 'newest', label: 'Newest', icon: <FaSortAmountDown /> },
    { value: 'oldest', label: 'Oldest', icon: <FaSortAmountUp /> },
    { value: 'price-low', label: 'Price: Low to High', icon: <FaSortAmountUp /> },
    { value: 'price-high', label: 'Price: High to Low', icon: <FaSortAmountDown /> },
    { value: 'rating', label: 'Highest Rated', icon: <FaStar /> },
  ];

  const priceRanges = [
    { label: 'Under KSh 1,000', min: 0, max: 1000 },
    { label: 'KSh 1,000 - 3,000', min: 1000, max: 3000 },
    { label: 'KSh 3,000 - 6,000', min: 3000, max: 6000 },
    { label: 'KSh 6,000 - 10,000', min: 6000, max: 10000 },
    { label: 'Over KSh 10,000', min: 10000, max: 100000 },
  ];

  const handleCategoryChange = (category) => {
    const newCategory = selectedCategory === category ? '' : category;
    setSelectedCategory(newCategory);
    updateSearchParams({ category: newCategory, page: 1 });
  };

  const handleSortChange = (sortBy) => {
    setSelectedSort(sortBy);
    updateSearchParams({ sortBy, page: 1 });
  };

  const handlePriceRangeChange = (min, max) => {
    updateSearchParams({ 
      minPrice: min || '', 
      maxPrice: max || '', 
      page: 1 
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateSearchParams({ page: newPage });
    }
  };

  const updateSearchParams = (updates) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSelectedCategory('');
    setSelectedSort('newest');
    setPriceRange([0, 50000]);
    setSearchParams(new URLSearchParams());
  };

  if (error) {
    return (
      <ShopContainer>
        <div className="container">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      </ShopContainer>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shop - Kibanda Sneakers & Clothing</title>
        <meta name="description" content="Browse our collection of sneakers, clothing, and accessories at Kibanda Fashion." />
      </Helmet>

      <ShopContainer>
        <div className="container">
          <ShopHeader>
            <h1>Shop Products</h1>
            <ProductCount>{totalProducts} products found</ProductCount>
            <FilterToggle onClick={() => setShowFilters(!showFilters)}>
              <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
            </FilterToggle>
          </ShopHeader>

          <ShopLayout>
            {/* Filters Sidebar */}
            <FiltersSidebar className={showFilters ? 'active' : ''}>
              <FilterHeader>
                <h3>Filters</h3>
                <CloseButton onClick={() => setShowFilters(false)}>
                  <FaTimes />
                </CloseButton>
              </FilterHeader>

              {/* Categories Filter */}
              <FilterSection>
                <h4>Categories</h4>
                <CategoryList>
                  {categories.map((category) => (
                    <CategoryItem
                      key={category._id}
                      active={selectedCategory === category.slug}
                      onClick={() => handleCategoryChange(category.slug)}
                    >
                      {category.name}
                      <span>({category.count})</span>
                    </CategoryItem>
                  ))}
                </CategoryList>
              </FilterSection>

              {/* Price Filter */}
              <FilterSection>
                <h4>Price Range (KES)</h4>
                <PriceRanges>
                  {priceRanges.map((range, index) => (
                    <PriceRangeItem
                      key={index}
                      onClick={() => handlePriceRangeChange(range.min, range.max)}
                    >
                      {range.label}
                    </PriceRangeItem>
                  ))}
                </PriceRanges>
                <PriceInputs>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => handlePriceRangeChange(e.target.value, filters.maxPrice)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handlePriceRangeChange(filters.minPrice, e.target.value)}
                  />
                </PriceInputs>
              </FilterSection>

              <ClearFilters onClick={handleClearFilters}>
                Clear All Filters
              </ClearFilters>
            </FiltersSidebar>

            {/* Products Section */}
            <ProductsSection>
              {/* Sort Options */}
              <SortBar>
                <SortOptions>
                  {sortOptions.map((option) => (
                    <SortOption
                      key={option.value}
                      active={selectedSort === option.value}
                      onClick={() => handleSortChange(option.value)}
                    >
                      {option.icon}
                      {option.label}
                    </SortOption>
                  ))}
                </SortOptions>
              </SortBar>

              {/* Products Grid */}
              {loading ? (
                <LoaderWrapper>
                  <Loader />
                </LoaderWrapper>
              ) : products.length === 0 ? (
                <NoProducts>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search terms</p>
                  <button onClick={handleClearFilters}>Clear Filters</button>
                </NoProducts>
              ) : (
                <>
                  <ProductsGrid>
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </ProductsGrid>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination>
                      <PaginationButton
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                      >
                        Previous
                      </PaginationButton>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <PaginationNumber
                          key={index + 1}
                          active={currentPage === index + 1}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </PaginationNumber>
                      ))}
                      
                      <PaginationButton
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                      >
                        Next
                      </PaginationButton>
                    </Pagination>
                  )}
                </>
              )}
            </ProductsSection>
          </ShopLayout>
        </div>
      </ShopContainer>
    </>
  );
};

const ShopContainer = styled.div`
  padding: 40px 0 80px;
  min-height: 70vh;
`;

const ShopHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;

  h1 {
    font-size: 32px;
    color: #2c3e50;
    margin: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProductCount = styled.p`
  color: #666;
  font-size: 16px;
  margin: 0;
`;

const FilterToggle = styled.button`
  display: none;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #5a67d8;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const ShopLayout = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FiltersSidebar = styled.aside`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 120px;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100vh;
    z-index: 1000;
    overflow-y: auto;
    transition: left 0.3s ease;
    border-radius: 0;
    padding-top: 80px;

    &.active {
      left: 0;
    }
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  h3 {
    color: #2c3e50;
    margin: 0;
    font-size: 20px;
  }
`;

const CloseButton = styled.button`
  display: none;
  font-size: 20px;
  color: #666;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 30px;

  h4 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 16px;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: ${props => props.active ? '#f0f4ff' : '#f8f9fa'};
  border: 2px solid ${props => props.active ? '#667eea' : '#e0e0e0'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: ${props => props.active ? '#667eea' : '#333'};

  &:hover {
    border-color: #667eea;
    background: #f0f4ff;
  }

  span {
    color: #666;
    font-size: 12px;
  }
`;

const PriceRanges = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const PriceRangeItem = styled.div`
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #333;

  &:hover {
    background: #f0f4ff;
    color: #667eea;
  }
`;

const PriceInputs = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  input {
    flex: 1;
    padding: 10px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #667eea;
      outline: none;
    }
  }

  span {
    color: #666;
  }
`;

const ClearFilters = styled.button`
  width: 100%;
  padding: 12px;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    border-color: #667eea;
    color: white;
  }
`;

const ProductsSection = styled.section`
  min-height: 500px;
`;

const SortBar = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`;

const SortOptions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const SortOption = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${props => props.active ? '#667eea' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 2px solid ${props => props.active ? '#667eea' : '#e0e0e0'};
  border-radius: 8px;
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    background: ${props => props.active ? '#5a67d8' : '#f0f4ff'};
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const NoProducts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;

  h3 {
    color: #2c3e50;
    margin-bottom: 10px;
  }

  p {
    color: #666;
    margin-bottom: 20px;
  }

  button {
    padding: 12px 30px;
    background: #667eea;
    color: white;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      background: #5a67d8;
      transform: translateY(-2px);
    }
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 50px;
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

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #e74c3c;
  background: #ffeaea;
  border-radius: 8px;
  margin: 20px 0;
`;

export default ShopPage;