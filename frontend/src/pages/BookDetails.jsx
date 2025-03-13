import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../App";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const BookDetails = () => {
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
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate(`/homepage/${user_id}`);
            }
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
          <p className="text-green-600 font-bold">Price: R {actualPrice}</p>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Reviews</h3>
            {reviews.length > 0 ? (
              <ul className="list-disc pl-5">
                {reviews.map((review, index) => (
                  <li key={index}>
                    <h1>
                      {new Date(review.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </h1>
                    <strong>{review.user_name}</strong>: {review.comment}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
