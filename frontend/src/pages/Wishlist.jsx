import React, { useEffect, useContext, useState } from "react";
import Menu from "../components/Menu";
import axios from "axios";
import { Context } from "../App";
import BookCard from "../components/BookCard";

const Wishlist = () => {
  const url = import.meta.env.VITE_BASE_URL;
  const user_id = useContext(Context);

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
    <div>
      Wishlist
      <Menu />
      <div className="flex gap-10">
        {books.map((book) => {
          return <BookCard key={book.id} book={book} setRefresh={setRefresh} />;
        })}
      </div>
    </div>
  );
};

export default Wishlist;
