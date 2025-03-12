
import React, { useState, useEffect } from "react";
import BookCard from "./BookCard";

const ManageBooks = () => {
  const [books, setBooks] = useState(mockBooks);

  const deleteBook = (bookId) => {
    setBooks(books.filter((book) => book.id !== bookId));
  };

  const editBook = (bookId) => {
    alert(`Edit book with ID: ${bookId}`);
  };

  return (
    <div className="manage-books">
      <h1>Manage Books</h1>
      <div className="book-list">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onDelete={deleteBook}
            onEdit={editBook}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageBooks;
