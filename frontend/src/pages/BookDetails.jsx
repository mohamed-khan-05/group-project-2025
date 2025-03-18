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
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!user_id) {
      return;
    }
    axios
      .post(`${url}/books/getbookdetails`, { book_id: bookid })
      .then((res) => {
        setBook(res.data.book);
        setReviews(res.data.reviews);
      });
  }, [bookid, user_id]);

  const available = book?.quantity > 0;
  const actualPrice = book
    ? book.price - book.price * (book.discount / 100)
    : 0;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      alert("Please provide both a rating and a comment.");
      return;
    }
    try {
      const response = await axios.post(`${url}/reviews/addreview`, {
        user_id,
        book_id: bookid,
        rating,
        comment,
      });
      setReviews([...reviews, response.data.review]);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!reviewId) {
      console.error("Invalid review ID");
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!isConfirmed) {
      return;
    }

    try {
      await axios.delete(`${url}/reviews/deletereview`, {
        data: { review_id: reviewId, user_id },
      });

      setReviews(reviews.filter((review) => review.review_id !== reviewId));
    } catch (error) {
      console.error("Error deleting review", error.response?.data || error);
    }
  };

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
                    <div>
                      {" "}
                      <h1>
                        {new Date(review.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </h1>
                      <strong>{review.user_name}</strong>: {review.comment}
                    </div>

                    {review.user_id === parseInt(user_id) && (
                      <button
                        onClick={() => handleDeleteReview(review.review_id)}
                        className="bg-red-500 text-white px-2 py-1 rounded ml-4"
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>

          {/* Add Review Form */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-2">
              <label>Rating:</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`w-10 h-10 flex items-center justify-center rounded-full border ${
                      rating >= num ? "bg-yellow-400" : "bg-gray-200"
                    }`}
                    onClick={() => setRating(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <label>Comment:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border rounded p-2"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
