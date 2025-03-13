import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AdminMenu from "../components/AdminMenu";
import AddBook from "../components/AddBook";
import AdminBookCard from "../components/AdminBookCard";

const ManageBooks = () => {
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [books, setBooks] = useState([]);
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

  return (
    <>
      {/* Mobile View */}
      <div className="flex sm:hidden">
        {/* Add component */}
        {showAdd && (
          <div>
            <div></div>
            <div>
              <div>
                <button onClick={() => setShowAdd(false)}>
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

        {/*  */}
        <div>
          <h2>Manage Books</h2>
          <div>
            <AdminMenu />
          </div>
          <button onClick={() => setShowAdd(true)}>Add Book</button>

          <div className="flex flex-wrap gap-5">
            {books.map((book) => (
              <AdminBookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>
      {/* -------------------------------------------------------------------------------------------------------------------------------------------------- */}
      {/* -------------------------------------------------------------------------------------------------------------------------------------------------- */}
      {/* -------------------------------------------------------------------------------------------------------------------------------------------------- */}

      {/* PC View */}
      <div className="hidden sm:block">
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

        {/*  */}
        <div>
          <h2>Manage Books</h2>
          <div>
            <AdminMenu />
          </div>
          <button onClick={() => setShowAdd(true)}>Add Book</button>

          <div className="flex flex-wrap gap-10 mb-10">
            {books.map((book) => (
              <AdminBookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageBooks;
