import React from "react";
import { useNavigate } from "react-router-dom";

const AdminBookCard = ({ book }) => {
  const navigate = useNavigate();
  var available;
  if (book.quantity > 0) {
    available = true;
  } else {
    available = false;
  }
  const actualPrice = book.price - book.price * (book.discount / 100);
  return (
    <div
      onClick={() => {
        navigate(`/bookdetails/${book.id}`);
      }}
      className="w-[45vw] sm:w-[300px] border p-2 sm:p-4 rounded shadow-md"
    >
      <div className="flex w-full justify-center">
        <img
          src={book.image}
          alt={book.title}
          className="w-full sm:w-[200px] sm:h-[250px] object-contain rounded mb-1"
        />
      </div>

      <h3 className="text-lg font-semibold">{book.title}</h3>
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

export default AdminBookCard;
