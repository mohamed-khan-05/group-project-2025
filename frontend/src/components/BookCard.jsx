import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import axios from "axios";
import { Context } from "../App";

const BookCard = ({ book, setRefresh }) => {
  const navigate = useNavigate();
  const user_id = useContext(Context);
  const url = import.meta.env.VITE_BASE_URL;
  const [inlist, setInlist] = useState(false);

  useEffect(() => {
    axios
      .post(`${url}/wishlist/inlist`, { user_id: user_id, book_id: book.id })
      .then((res) => {
        setInlist(res.data.inlist);
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
    setRefresh((prev) => {
      prev + 1;
    });
  };

  const removefromlist = () => {
    axios.post(`${url}/wishlist/remove`, {
      user_id: user_id,
      book_id: book.id,
    });
    setInlist(false);
    setRefresh((prev) => {
      prev + 1;
    });
  };

  return (
    <div className="w-[45vw] sm:w-[300px] border p-2 sm:p-2 rounded shadow-md">
      <div>
        <button
          onClick={() => {
            {
              inlist ? removefromlist() : addtolist();
            }
          }}
          className={inlist ? "text-red-500" : "text-black"}
        >
          <FaHeart />
        </button>
      </div>
      <div
        onClick={() => {
          navigate(`/bookdetails/${book.id}`);
        }}
        className="flex w-full justify-center"
      >
        <img
          src={book.image}
          alt={book.title}
          className="w-full sm:w-[200px] sm:h-[250px] object-contain rounded mb-1"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <button className="cursor-pointer">
          <FaShoppingCart />
        </button>
      </div>

      {book.discount > 0 ? (
        <div className="sm:flex gap-3 sm:gap-5">
          <h1 className="text-yellow-600 line-through sm:text-lg text-sm">
            R {book.price}
          </h1>
          <h1 className="text-green-600 sm:text-lg text-[1.2rem]">
            R {actualPrice}
          </h1>
        </div>
      ) : (
        <h1 className="text-green-600 sm:text-lg">R {book.price}</h1>
      )}

      <p className="text-sm text-gray-600">{book.category}</p>
      {available ? (
        <p className="text-blue-500">Available</p>
      ) : (
        <p className="text-red-500">Sold-out</p>
      )}
    </div>
  );
};

export default BookCard;
