import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';

interface CompactPaginationProps {
  pageNumber: number;
  numberOfPages: number;
  setPageNumber: (page: number) => void;
}

export default function CompactPagination({ pageNumber, numberOfPages, setPageNumber }: CompactPaginationProps) {
  const decrementPageNumber = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const incrementPageNumber = () => {
    if (pageNumber < numberOfPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4 py-4">
      <button
        onClick={decrementPageNumber}
        disabled={pageNumber === 1}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <ArrowLongLeftIcon className="w-5 h-5 text-gray-600" />
      </button>

      <span className="text-sm font-medium text-gray-700">
        {pageNumber} / {numberOfPages}
      </span>

      <button
        onClick={incrementPageNumber}
        disabled={pageNumber === numberOfPages}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <ArrowLongRightIcon className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}
