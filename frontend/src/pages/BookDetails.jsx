import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../App";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

//  media
import { ArrowLeft } from "lucide-react";

const BookDetails = () => {
  const url = import.meta.env.VITE_BASE_URL;
  const user_id = parseInt(useContext(Context));
  const navigate = useNavigate();
  const { bookid } = useParams();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [incart, setIncart] = useState(false);
  const [counter, setCounter] = useState(0);
  const [quantity, setQuantity] = useState();

  useEffect(() => {
    if (!user_id) return;
    axios
      .post(`${url}/cart/getamount`, { user_id, book_id: bookid })
      .then((res) => {
        setQuantity(parseInt(res.data.quantity) || 0);
      })
      .catch((error) => console.error("Error fetching cart amount:", error));
  }, [user_id, bookid, counter]);

  useEffect(() => {
    if (!user_id) return;
    axios
      .post(`${url}/books/getbookdetails`, { book_id: bookid })
      .then((res) => {
        setBook(res.data.book);
        setReviews(res.data.reviews);
      })
      .catch((error) => console.error("Error fetching book details:", error));

    axios
      .post(`${url}/cart/incart`, { user_id, book_id: bookid })
      .then((res) => setIncart(res.data.incart))
      .catch((error) => console.error("Error checking cart status:", error));
  }, [bookid, user_id]);

  const actualPrice = book
    ? book.price - (book.price * book.discount) / 100
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
      toast.success("Review submitted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error submitting review", error);
      toast.error("Failed to submit review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!reviewId) return;

    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`${url}/reviews/deletereview`, {
        data: { review_id: reviewId, user_id },
      });
      setReviews(reviews.filter((review) => review.review_id !== reviewId));
      toast.success("Review deleted.");
    } catch (error) {
      console.error("Error deleting review", error);
      toast.error("Failed to delete review.");
    }
  };

  const addtocart = () => {
    if (!book) return;

    const finalPrice = book.price - (book.price * book.discount) / 100;

    axios
      .post(`${url}/cart/addtocart`, {
        user_id,
        book_id: book.id,
        quantity: 1,
        total: finalPrice,
        discount_amount: book.discount,
      })
      .then((res) => {
        if (res.data.message === "success") {
          setIncart(true);
          setCounter(counter + 1);
        } else {
          toast.error("Book already in cart");
        }
      })
      .catch((error) => toast.error("Error adding to cart."));
  };

  const removefromcart = () => {
    if (!book) return;

    axios
      .post(`${url}/cart/remove`, {
        user_id,
        book_id: book.id,
      })
      .then(() => {
        setIncart(false);
        setQuantity(0);
      })
      .catch((error) => toast.error("Error removing from cart."));
  };

  const updateQuantity = async (bookId, newQuantity) => {
    if (newQuantity < 1) {
      if (!window.confirm("Are you sure you want to remove this item?")) {
        return;
      }
      removefromcart();
      return;
    }

    try {
      await axios.post(`${url}/cart/update-quantity`, {
        user_id,
        book_id: bookId,
        quantity: newQuantity,
      });

      setQuantity(newQuantity);
      setCounter(counter - 1);
    } catch (error) {
      console.error("Error updating quantity", error);
      toast.error(`Only ${quantity} left`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-lg">
      <ToastContainer hideProgressBar />
      <button
        onClick={() =>
          window.history.length > 1
            ? navigate(-1)
            : navigate(`/homepage/${user_id}`)
        }
        className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-800 transition-all cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {!book ? (
        <div className="text-center text-lg font-semibold">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              className="w-full h-full object-cover"
              src={book.image}
              alt={book.title}
            />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold break-words">{book.title}</h1>
            <p className="text-lg text-gray-700">by {book.author}</p>
            <p className="text-sm text-gray-500">Category: {book.category}</p>
            <p className="text-gray-600 break-words">{book.description}</p>
            <p className="text-2xl text-green-600 font-bold">
              R {actualPrice.toFixed(2)}
            </p>

            {book.quantity <= 0 ? (
              <div>
                <h1 className="text-red-500 text-lg sm:text-2xl">Sold-out</h1>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-4">
                {incart ? (
                  <div className="flex flex-col items-center border rounded-lg p-4 shadow-md">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateQuantity(bookid, quantity - 1)}
                        className="w-10 h-10 cursor-pointer font-bold bg-gray-200 rounded-full flex items-center justify-center text-xl hover:bg-gray-300 transition"
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(bookid, quantity + 1)}
                        className="w-10 h-10 cursor-pointer bg-gray-200 rounded-full flex items-center justify-center text-xl hover:bg-gray-300 transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={removefromcart}
                      className="mt-3 px-4 py-2 cursor-pointer bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                      Remove from Cart
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={addtocart}
                    className="px-6 py-3 bg-blue-500 cursor-pointer text-white font-semibold text-lg rounded-lg shadow-md hover:bg-blue-600 transition w-full"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            )}

            <button
              className="px-6 py-3 bg-green-500 cursor-pointer text-white font-semibold text-lg rounded-lg shadow-md hover:bg-green-600 transition w-full"
              onClick={() => {
                navigate(`/cart/${user_id}`);
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Reviews</h3>
        {reviews.length > 0 ? (
          <ul className="mt-2 space-y-4">
            {reviews.map((review) => (
              <li
                key={review.review_id}
                className="p-4 border rounded-lg shadow-sm"
              >
                <div className="text-gray-600 text-sm">
                  {new Date(review.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <p className="font-semibold">{review.user_name}</p>
                <div className="flex space-x-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
                {review.user_id === parseInt(user_id) && (
                  <button
                    onClick={() => handleDeleteReview(review.review_id)}
                    className="mt-2 text-sm text-red-500 hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>

      {/* Add Review Form */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Write a Review</h3>
        <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Rating:</label>
            <div className="flex space-x-2 mt-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`w-10 h-10 flex items-center justify-center rounded-full border text-lg font-bold ${
                    rating >= num
                      ? "bg-yellow-400 cursor-pointer"
                      : "bg-gray-200 cursor-pointer"
                  }`}
                  onClick={() => setRating(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows="3"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full cursor-pointer"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookDetails;
// Good
