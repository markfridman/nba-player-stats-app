import React from 'react';
import { Button } from './ui/button';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  perPage: number;
  totalCount: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  perPage,
  totalCount
}) => {
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalCount);

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.pageInfo}>
        Showing {startItem} to {endItem} of {totalCount} results
      </div>
      
      <div className={styles.pageControls}>
        <Button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          Previous
        </Button>
        <span className={styles.currentPage}>
          Page {currentPage} of {totalPages}
        </span>
        <Button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          Next
        </Button>
      </div>
    </div>
  );
};