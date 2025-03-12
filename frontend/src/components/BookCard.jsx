import React from "react";

const BookCard = ({book}) => {
  return <div key={book.id} className="book-item">
  <img src={book.image} alt={book.title} className="book-image" />
  <h2>{book.title}</h2>
  <p>{book.author}</p>
  <p>{book.description}</p>
  <p><strong>Price:</strong> ${book.price}</p>
  <button>Add to Cart</button>
</div>;
};

export default BookCard;
