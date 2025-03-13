import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../App";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AdminBookDetails = () => {
  const url = import.meta.env.VITE_BASE_URL;
  const user_id = useContext(Context);
  const navigate = useNavigate();
  const { bookid } = useParams();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .post(`${url}/books/getbookdetails`, { book_id: bookid })
      .then((res) => {
        setBook(res.data.book);
        setReviews(res.data.reviews);
      });
  }, [bookid]);

  const available = book?.quantity > 0;
  const actualPrice = book
    ? book.price - book.price * (book.discount / 100)
    : 0;

  return (
    <div className="p-4">
      {!book ? null : (
        <button
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </button>
      )}

      <h1 className="text-2xl font-bold mb-4">Book Details</h1>
      {!book ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="w-[50vw] h-[50vh]">
            <img
              className="object-contain w-full h-full"
              src={book.image}
              alt={book.title}
            />
          </div>
          <h2 className="text-xl font-semibold">{book.title}</h2>
          <p className="text-gray-700">by {book.author}</p>
          <p className="text-gray-500">{book.category}</p>
          <p>{book.description}</p>
          <p className="text-green-600 font-bold">Price: R {book.price}</p>
          <p>{book.discount}</p>
          <p>{book.amount}</p>
        </div>
      )}
    </div>
  );
};

export default AdminBookDetails;
