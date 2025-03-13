import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API requests
import BookCard from "../components/BookCard";

const HomePage = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch books from the Flask API when the component mounts
    axios
      .get("http://localhost:5000/api/books") // Change URL based on your Flask server
      .then((response) => {
        setBooks(response.data); // Update state with the fetched books
      })
      .catch((error) => {
        console.error("There was an error fetching the books!", error);
      });
  }, []);

  return (
    <div className="book-list">
      <h1>Books to Buy</h1>
      <div className="books">
        {books.length === 0 ? (
          <p>No books available at the moment</p>
        ) : (
          books.map((book) => <BookCard book={book} />)
        )}
      </div>
    </div>
  );
};

export default HomePage;
