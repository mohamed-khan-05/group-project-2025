import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AdminMenu from "../components/AdminMenu";
import AddBook from "../components/AddBook";
import AdminBookCard from "../components/AdminBookCard";

// Media
import { FaRegArrowAltCircleUp } from "react-icons/fa";

const ManageBooks = () => {
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("available");
  const url = import.meta.env.VITE_BASE_URL;

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${url}/books/getallbooks`);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && book.quantity > 0) ||
      (availabilityFilter === "sold-out" && book.quantity === 0);
    return matchesSearch && matchesAvailability;
  });

  return (
    <>
      <div>
        {/* Add component */}
        {showAdd && (
          <div className="w-[100vw] h-[100vh] fixed flex justify-center items-center">
            <div className="fixed flex justify-center items-center bg-black w-[100vw] h-[100vh] opacity-50 z-50"></div>
            <div className="bg-white p-20 z-51">
              <div>
                <button
                  className="flex justify-self-end text-red-500 cursor-pointer"
                  onClick={() => setShowAdd(false)}
                >
                  <AiOutlineClose size={32} />
                </button>
                <AddBook
                  refreshBooks={fetchBooks}
                  closeModal={() => setShowAdd(false)}
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <div>
            <AdminMenu />
          </div>
          <div className="sm:flex">
            <div>
              <button
                className="bg-blue-600 px-2 py-1 text-white rounded-sm mb-2 ml-2"
                onClick={() => setShowAdd(true)}
              >
                Add Book
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-2 mb-4 ml-2">
              <input
                type="text"
                placeholder="Search book by name"
                className="border px-2 py-1 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="border px-2 py-1 rounded"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="sold-out">Sold-out</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {filteredBooks.map((book) => (
              <AdminBookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>

      <div
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed z-10 bottom-10 right-10 cursor-pointer bg-blue-500 rounded-full w-15 h-15 flex justify-center items-center"
      >
        <FaRegArrowAltCircleUp className="w-10 h-10" />
      </div>
    </>
  );
};

export default ManageBooks;
