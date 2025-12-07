import React from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisible = 5 
}) => {
  const getPageNumbers = () => {
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisible - 1, totalPages);

    if (end - start + 1 < maxVisible) {
      start = Math.max(end - maxVisible + 1, 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <PaginationContainer>
      <PaginationInfo>
        Page {currentPage} of {totalPages}
      </PaginationInfo>

      <PaginationButtons>
        {showFirstLast && (
          <PaginationButton
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            title="First Page"
          >
            «
          </PaginationButton>
        )}

        {showPrevNext && (
          <PaginationButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            title="Previous Page"
          >
            <FaChevronLeft />
          </PaginationButton>
        )}

        {pageNumbers.map(page => (
          <PaginationNumber
            key={page}
            active={currentPage === page}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </PaginationNumber>
        ))}

        {showPrevNext && (
          <PaginationButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            title="Next Page"
          >
            <FaChevronRight />
          </PaginationButton>
        )}

        {showFirstLast && (
          <PaginationButton
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            title="Last Page"
          >
            »
          </PaginationButton>
        )}
      </PaginationButtons>

      <PageInput>
        <span>Go to:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
              handlePageChange(page);
            }
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                handlePageChange(page);
              }
            }
          }}
        />
      </PageInput>
    </PaginationContainer>
  );
};

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const PaginationInfo = styled.div`
  color: #666;
  font-size: 14px;
  font-weight: 600;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const PaginationButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #667eea;
    border-color: #667eea;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    font-size: 12px;
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
  background: ${props => props.active ? '#667eea' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 2px solid ${props => props.active ? '#667eea' : '#e0e0e0'};

  &:hover:not(.active) {
    background: ${props => props.active ? '#5a67d8' : '#e0e0e0'};
  }
`;

const PageInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    color: #666;
    font-size: 14px;
    font-weight: 600;
  }

  input {
    width: 60px;
    padding: 8px 12px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    text-align: center;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #667eea;
      outline: none;
    }
  }
`;

export default Pagination;