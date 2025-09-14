"use client";

import { useEffect, useState, useCallback } from "react";

export default function Home() {
  const [advocates, setAdvocates] = useState([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchAdvocates = useCallback(async () => {
    console.log("fetching advocates...");
    try {
      const response = await fetch(
        `/api/advocates?page=${currentPage}&limit=${pageSize}`
      );
      const jsonResponse = await response.json();
      setAdvocates(jsonResponse.data);
      setFilteredAdvocates(jsonResponse.data);
      setPagination(jsonResponse.pagination);
    } catch (error) {
      console.error("Error fetching advocates:", error);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchAdvocates();
  }, [fetchAdvocates]);

  const onChange = (e) => {
    const searchTerm = e.target.value;

    document.getElementById("search-term").innerHTML = searchTerm;

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        advocate.specialties.includes(searchTerm) ||
        advocate.yearsOfExperience.toString().includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
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
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Solace Advocates
      </h1>

      <div className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Search</h2>
        <p className="text-sm text-gray-600">
          Searching for:{" "}
          <span id="search-term" className="font-medium text-gray-900"></span>
        </p>
        <div className="flex gap-3 items-center">
          <input
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search advocates..."
            onChange={onChange}
          />
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onClick}
          >
            Reset Search
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
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
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAdvocates.map((advocate, index) => {
              return (
                <tr key={index} className="hover:bg-gray-50">
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
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-1">
                      {advocate.specialties.map((s, i) => (
                        <div
                          key={i}
                          className="text-xs bg-gray-100 px-2 py-1 rounded inline-block mr-1 mb-1"
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {advocate.yearsOfExperience}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {advocate.phoneNumber}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
