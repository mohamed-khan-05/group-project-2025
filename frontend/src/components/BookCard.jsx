import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import axios from "axios";
import { Context } from "../App";
import { toast } from "react-toastify";

const BookCard = ({ book, setRefresh, selectedCategory }) => {
  const navigate = useNavigate();
  const user_id = useContext(Context);
  const url = import.meta.env.VITE_BASE_URL;
  const [inlist, setInlist] = useState(false);
  const [incart, setIncart] = useState(false);

  useEffect(() => {
    axios
      .post(`${url}/wishlist/inlist`, { user_id: user_id, book_id: book.id })
      .then((res) => {
        setInlist(res.data.inlist);
      });

    axios
      .post(`${url}/cart/incart`, { user_id: user_id, book_id: book.id })
      .then((res) => {
        setIncart(res.data.incart);
      });
  }, [user_id, book.id]);

  const available = book.quantity > 0;
  const actualPrice = book.price - book.price * (book.discount / 100);

  const addtolist = () => {
    axios.post(`${url}/wishlist/addtowishlist`, {
      user_id: user_id,
      book_id: book.id,
    });
    setInlist(true);
    toast.success("Added to Wishlist");
    setRefresh((prev) => prev + 1);
  };

  const removefromlist = () => {
    axios.post(`${url}/wishlist/remove`, {
      user_id: user_id,
      book_id: book.id,
    });
    setInlist(false);
    setRefresh((prev) => prev + 1);
  };

  const addtocart = () => {
    const finalPrice = book.price - (book.price * book.discount) / 100;

    axios
      .post(`${url}/cart/addtocart`, {
        user_id: parseInt(user_id),
        book_id: book.id,
        quantity: 1,
        total: finalPrice,
        discount_amount: book.discount,
      })
      .then((res) => {
        if (res.data.message === "success") {
          setIncart(true);
          toast.success("Added to Cart");
          setRefresh((prev) => prev + 1);
        } else {
          toast.error("Book already in cart");
        }
      });
  };

  const removefromcart = () => {
    axios
      .post(`${url}/cart/remove`, {
        user_id: parseInt(user_id),
        book_id: book.id,
      })
      .then(() => {
        setIncart(false);
        setRefresh((prev) => prev + 1);
      });
  };

  if (selectedCategory !== "" && !book.category.includes(selectedCategory)) {
    return null;
  }

  return (
    <div
      style={{ display: book.quantity > 0 ? "block" : "none" }}
      className="w-[45vw] sm:w-[200px] max-h-[50vh] overflow-y-auto border p-2 sm:p-2 rounded shadow-md bg-white"
    >
      <div>
        <button
          onClick={() => (inlist ? removefromlist() : addtolist())}
          className={
            inlist ? "text-red-500 cursor-pointer" : "text-black cursor-pointer"
          }
        >
          <FaHeart />
        </button>
      </div>
      <div
        onClick={() => navigate(`/bookdetails/${book.id}`)}
        className="flex w-full justify-center"
      >
        <img
          src={book.image}
          alt={book.title}
          className="w-full sm:w-[150px] sm:h-[150px] object-contain rounded mb-1 cursor-pointer"
        />
      </div>

      <div className="flex justify-between">
        <h3 className="text-lg font-semibold break-words w-[85%]">
          {book.title}
        </h3>
        <button
          onClick={() => (incart ? removefromcart() : addtocart())}
          className={incart ? `cursor-pointer text-blue-500` : "cursor-pointer"}
        >
          <FaShoppingCart />
        </button>
      </div>

      {book.discount > 0 ? (
        <div className="sm:flex gap-3 sm:gap-5">
          <h1 className="text-yellow-600 line-through sm:text-lg text-sm">
            R {book.price}
          </h1>
          <h1 className="text-green-600 sm:text-lg text-[1.2rem]">
            R {actualPrice.toFixed(2)}
          </h1>
        </div>
      ) : (
        <h1 className="text-green-600 sm:text-lg">R {book.price}</h1>
      )}

      <p className="text-sm text-gray-600">{book.category}</p>
      {available ? (
        <p className="text-blue-500">Available</p>
      ) : (
        <p className="text-red-500">Unavailable</p>
      )}
    </div>
  );
};

export default BookCard;
