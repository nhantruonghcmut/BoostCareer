import React from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'

export const Pagination = ({ activePage, totalPages, onPageChange }) => {
  const renderPaginationItems = () => {
    const items = [];
    
    // Add Previous button
    items.push(
      <CPaginationItem 
        key="prev" 
        aria-label="Previous" 
        disabled={activePage === 1}
        onClick={() => onPageChange(activePage - 1)}
      >
        <span aria-hidden="true">&laquo;</span>
      </CPaginationItem>
    );

    // Calculate range of pages to show
    let startPage = Math.max(1, activePage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Adjust start if end is at max
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }

    // Add first page and ellipsis if necessary
    if (startPage > 1) {
      items.push(
        <CPaginationItem 
          key={1} 
          active={activePage === 1}
          onClick={() => onPageChange(1)}
        >
          1
        </CPaginationItem>
      );
      if (startPage > 2) {
        items.push(<CPaginationItem key="ellipsis1">...</CPaginationItem>);
      }
    }

    // Add page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <CPaginationItem 
          key={page} 
          active={page === activePage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </CPaginationItem>
      );
    }

    // Add last page and ellipsis if necessary
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<CPaginationItem key="ellipsis2">...</CPaginationItem>);
      }
      items.push(
        <CPaginationItem 
          key={totalPages} 
          active={activePage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </CPaginationItem>
      );
    }

    // Add Next button
    items.push(
      <CPaginationItem 
        key="next" 
        aria-label="Next" 
        disabled={activePage === totalPages}
        onClick={() => {
            if (activePage < totalPages)
           return onPageChange(activePage + 1)}}
      >
        <span aria-hidden="true">&raquo;</span>
      </CPaginationItem>
    );

    return items;
  };

  return (
    <CPagination className="justify-content-center mt-3">
      {renderPaginationItems()}
    </CPagination>
  );
};

export default Pagination;