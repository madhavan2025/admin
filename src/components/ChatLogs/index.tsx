"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon
} from "@heroicons/react/20/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type ChatRow = {
  dateTime: string;
  userId: string;
  chatId: string;
  question: string;
  answer: string;
};

type Props = {
  customerId: string | null;
};

const ChatLogs: React.FC<Props> = () => {
  const [chatData, setChatData] = useState<ChatRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  const customerId = "client-d";

  const fetchChats = async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/chats?customerId=${customerId}`);
      const data = await res.json();
      setChatData(data.data || []);
    } catch (err) {
      console.error("Error fetching chats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchChats();
    }
  }, [customerId]);

  // Filter data based on date and search term
  const filteredData = chatData.filter((row) => {
    const matchDate = selectedDate
      ? new Date(row.dateTime).toDateString() === selectedDate.toDateString()
      : true;
    const matchSearch = searchTerm
      ? row.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.chatId.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchDate && matchSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mt-8">
      {/* Filters Row */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Date Filter */}
          <div>
            <label className="text-sm block mb-1">Filter by Date:</label>
            <DatePicker
  selected={selectedDate}
  onChange={(date: Date | null) => setSelectedDate(date)}
  dateFormat="yyyy-MM-dd"
  placeholderText="Select a date"
  className="border px-3 py-2 rounded w-full sm:w-auto"
/>
          </div>

          {/* Reset Filter */}
          <div className="self-end">
            <button
              onClick={() => {
                setSelectedDate(null);
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 transition-all text-sm"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Search Filter */}
        <div className="w-full sm:w-1/3">
          <label className="text-sm block mb-1">Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search chats..."
            className="border px-3 py-2 rounded w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-stroke dark:border-dark-3">
          <thead>
            <tr className="bg-gray-100 dark:bg-dark-2 text-left">
              <th className="p-3 border">Sl.No</th>
              <th className="p-3 border">Date & Time</th>
              <th className="p-3 border">User ID</th>
              <th className="p-3 border">Chat ID</th>
              <th className="p-3 border">Question</th>
              <th className="p-3 border">Answer</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3 border">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-3 border">
                    {new Date(row.dateTime).toLocaleString()}
                  </td>
                  <td className="p-3 border">{row.userId}</td>
                  <td className="p-3 border">{row.chatId}</td>
                  <td className="p-3 border">{row.question}</td>
                  <td className="p-3 border">{row.answer}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No chat data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-1 sm:gap-4 text-xs sm:text-base">
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className="px-2 sm:px-4 py-1 bg-gray-200 border rounded"
          >
            <ChevronDoubleLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </button>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 sm:px-4 py-1 bg-gray-200 border rounded"
          >
            <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </button>
          <span className="px-2 sm:px-4 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 sm:px-4 py-1 bg-gray-200 border rounded"
          >
            <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </button>
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 sm:px-4 py-1 bg-gray-200 border rounded"
          >
            <ChevronDoubleRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatLogs;