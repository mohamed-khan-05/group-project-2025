import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

// media
import { RiDeleteBin6Line } from "react-icons/ri";

const AdminBookCard = ({ book }) => {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BASE_URL;

  const deletebook = () => {
    const agree = window.confirm("Do you want to delete this book ?");
    if (agree) {
      axios
        .post(`${url}/books/deletebook`, { book_id: book.id })
        .then(window.location.reload());
    }
  };

  var available;
  if (book.quantity > 0) {
    available = true;
  } else {
    available = false;
  }
  const actualPrice = book.price - book.price * (book.discount / 100);
  return (
    <>
      <ToastContainer />
      <div className="w-[45vw] sm:w-[300px] border p-2 sm:p-4 rounded shadow-md">
        <button
          className="text-red-500 text-2xl cursor-pointer"
          onClick={() => {
            deletebook();
          }}
        >
          <RiDeleteBin6Line />
        </button>
        <div className="flex w-full justify-center">
          <img
            onClick={() => {
              navigate(`/adminbookdetails/${book.id}`);
            }}
            src={book.image}
            alt={book.title}
            className="w-full sm:w-[200px] sm:h-[250px] object-contain rounded mb-1 cursor-pointer"
          />
        </div>
        <h3 className="text-lg font-semibold break-words">{book.title}</h3>
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
          <p className="text-red-500">Sold-out</p>
        )}
      </div>
    </>
  );
};

export default AdminBookCard;
