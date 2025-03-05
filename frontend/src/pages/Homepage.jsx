import React, { useContext, useEffect, useState } from "react";
import Menu from "../components/Menu";
import axios from "axios";
import BookCard from "../components/BookCard";

const Homepage = () => {
  const url = import.meta.env.VITE_BASE_URL;
  const [books, setBooks] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios.get(`${url}/books/getallbooks`).then((res) => {
      setBooks(res.data);
    });
  }, []);
  return (
    <div>
      Homepage
      <Menu />
      <div className="flex gap-10">
        {books.map((book) => {
          return <BookCard key={book.id} book={book} setRefresh={setRefresh} />;
        })}
      </div>
    </div>
  );
};

export default Homepage;
