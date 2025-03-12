import React from "react";

const BookCard = ({ book, onDelete, onEdit }) => {
  
  const discountedPrice = book.discount
    ? (book.price - book.price * (book.discount / 100)).toFixed(2)
    : book.price.toFixed(2);

  return (
    <div className="book-card">
      <img src={book.image} alt={book.name} />
      <h3>{book.name}</h3>

      <div className="book-details">
        <p><strong>Price:</strong> ${book.price}</p>
        {book.discount > 0 && (
          <p>
            <strong>Discount:</strong> {book.discount}% OFF
          </p>
        )}
        <p>
          <strong>Discounted Price:</strong> ${discountedPrice}
        </p>
        <p><strong>Quantity:</strong> {book.quantity}</p>
        <p><strong>Availability:</strong> {book.quantity > 0 ? 'In Stock' : 'Out of Stock'}</p>
      </div>

      <div className="book-actions">
        <button onClick={() => onEdit(book.id)}>Edit</button>
        <button onClick={() => onDelete(book.id)}>Delete</button>
      </div>
    </div>
  );
};

export default BookCard;
