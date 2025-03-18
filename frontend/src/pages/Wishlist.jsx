import React, { useEffect, useContext, useState } from "react";
import Menu from "../components/Menu";
import axios from "axios";
import { Context } from "../App";
import BookCard from "../components/BookCard";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const url = import.meta.env.VITE_BASE_URL;
  const user_id = useContext(Context);
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!user_id) {
      return;
    }

    const getList = async () => {
      try {
        const response = await axios.post(`${url}/wishlist/getwishlist`, {
          user_id,
        });
        setBooks(response.data.wishlist);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };

    getList();
  }, [user_id, refresh]);

  return (
    <div className="min-h-screen bg-gray-900 text-white sm:p-6 p-2">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(`/homepage/${user_id}`)}
          className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-all rounded-md shadow-md text-lg font-semibold"
        >
          ⬅ Back to Home
        </button>

        <h2 className="text-3xl font-bold mb-4 text-center">
          Your Wishlist 📚
        </h2>

        {books.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            Your wishlist is empty.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                setRefresh={setRefresh}
                selectedCategory=""
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
