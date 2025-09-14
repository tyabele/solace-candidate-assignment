"use client";

import { useEffect, useState, useCallback, memo } from "react";
import SolaceLogo from "../components/SolaceLogo";

interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
}

const formatPhoneNumber = (phoneNumber: number): string => {
  const phoneStr = phoneNumber.toString();
  // Format as (XXX) XXX-XXXX
  return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
};

const AdvocateRow = memo(({ advocate, openTooltip, onTooltipToggle }: {
  advocate: Advocate;
  openTooltip: string | null;
  onTooltipToggle: (advocateId: string) => void;
}) => {
  const advocateId = `${advocate.firstName}-${advocate.lastName}-${advocate.phoneNumber}`;
  const showTooltip = openTooltip === advocateId;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {advocate.firstName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {advocate.lastName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {advocate.city}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {advocate.degree}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 relative">
        <div className="space-y-1">
          {advocate.specialties.slice(0, 2).map((s, i) => (
            <div
              key={`${advocate.firstName}-${advocate.lastName}-${s}-${i}`}
              className="text-xs bg-gray-100 px-2 py-1 rounded inline-block mr-1 mb-1"
            >
              {s}
            </div>
          ))}
          {advocate.specialties.length > 2 && (
            <div className="relative inline-block">
              <button
                onClick={() => onTooltipToggle(advocateId)}
                className="text-xs text-blue-500 hover:text-blue-700 underline cursor-pointer inline-block mr-1 mb-1"
              >
                +{advocate.specialties.length - 2} more...
              </button>
              {showTooltip && (
                <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 mt-1 min-w-64 max-w-80">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">All Specialties</span>
                    <button
                      onClick={() => onTooltipToggle('')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-1">
                    {advocate.specialties.map((s, i) => (
                      <div
                        key={`tooltip-${advocate.firstName}-${advocate.lastName}-${s}-${i}`}
                        className="text-xs bg-gray-50 px-2 py-1 rounded inline-block mr-1 mb-1"
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {advocate.yearsOfExperience}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <a
          href={`tel:${advocate.phoneNumber}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {formatPhoneNumber(advocate.phoneNumber)}
        </a>
      </td>
    </tr>
  );
});

AdvocateRow.displayName = 'AdvocateRow';

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchAdvocates = useCallback(async () => {
    console.log("fetching advocates...");
    try {
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
      const response = await fetch(
        `/api/advocates?page=${currentPage}&limit=${pageSize}${searchParam}`
      );
      const jsonResponse = await response.json();
      setAdvocates(jsonResponse.data);
      setPagination(jsonResponse.pagination);
    } catch (error) {
      console.error("Error fetching advocates:", error);
    }
  }, [currentPage, pageSize, searchTerm]);

  useEffect(() => {
    fetchAdvocates();
  }, [fetchAdvocates]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset to first page when searching
  };

  const onClick = () => {
    setSearchTerm('');
    setCurrentPage(1); // Reset to first page when clearing search
  };

  const handleTooltipToggle = (advocateId: string) => {
    setOpenTooltip(openTooltip === advocateId ? null : advocateId);
  };

  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(
      pagination.totalPages,
      startPage + maxPagesToShow - 1
    );

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <main className="h-screen flex flex-col p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <SolaceLogo />
        <h1 className="text-3xl font-bold text-gray-900">
          Advocates
        </h1>
      </div>

      <div className="mb-8">
        <div className={`flex items-center border-2 rounded-lg overflow-hidden transition-colors w-1/3 ${
          searchTerm
            ? 'border-[#265b4e] focus-within:ring-2 focus-within:ring-[#265b4e] focus-within:ring-opacity-20'
            : 'border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent'
        }`}>
          <div className="px-3 py-2 bg-gray-50 text-gray-600 text-sm font-medium border-r border-gray-200">
            Search
          </div>
          <input
            className="flex-1 px-3 py-2 focus:outline-none bg-white"
            placeholder="Advocate details..."
            value={searchTerm}
            onChange={onChange}
          />
          {searchTerm && (
            <button
              onClick={onClick}
              className="m-1 w-8 h-8 rounded-full text-white transition-colors hover:opacity-90 flex items-center justify-center"
              style={{backgroundColor: '#265b4e'}}
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto flex-1 flex flex-col">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  First Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Degree
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Years of Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
              </tr>
            </thead>
          </table>
          <div className="flex-1 overflow-y-auto">
            <table className="min-w-full">
              <tbody className="bg-white divide-y divide-gray-200">
                {advocates.map((advocate) => (
                  <AdvocateRow
                    key={`${advocate.firstName}-${advocate.lastName}-${advocate.phoneNumber}`}
                    advocate={advocate}
                    openTooltip={openTooltip}
                    onTooltipToggle={handleTooltipToggle}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-700">per page</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Showing{" "}
            {Math.min((currentPage - 1) * pageSize + 1, pagination.totalCount)}{" "}
            to {Math.min(currentPage * pageSize, pagination.totalCount)} of{" "}
            {pagination.totalCount} results
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(1)}
            disabled={!pagination.hasPreviousPage}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPreviousPage}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {generatePageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                pageNum === currentPage
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
        </div>
      </div>
    </main>
  );
}
