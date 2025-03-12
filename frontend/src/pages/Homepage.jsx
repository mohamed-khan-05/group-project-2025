import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "../components/Menu";
import { Context } from "../App";
import axios from "axios";

import BookCard from "../components/BookCard";

// Media
import { RxHamburgerMenu } from "react-icons/rx";
import { RiCloseLargeFill } from "react-icons/ri";
import { FaCartShopping } from "react-icons/fa6";
import { GoSearch } from "react-icons/go";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { ToastContainer } from "react-toastify";

const Homepage = () => {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BASE_URL;
  const [showmenu, setShowmenu] = useState(false);
  const { userid } = useParams();
  const user_id = useContext(Context);

  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (userid != user_id && user_id != null) {
      localStorage.removeItem("user_id");
      navigate("/");
      return;
    }

    axios.get(`${url}/books/getallbooks`).then((res) => {
      setBooks(res.data);
      setLoading(false);
    });

    axios
      .post(`${url}/cart/getcartamount`, { user_id: user_id })
      .then((res) => {
        setAmount(res.data.cart);
      });
  }, [user_id, userid, url, refresh]);

  return (
    <>
      <ToastContainer autoClose={1500} closeOnClick />
      {/* Mobile */}
      <div className="sm:hidden ">
        <header className="flex w-[100vw] bg-blue-300 py-3">
          <div className="flex w-full justify-between items-center">
            <div></div>
            {showmenu ? (
              <div className="flex absolute top-0 left-0">
                <Menu />
                <div
                  className="text-3xl cursor-pointer"
                  onClick={() => {
                    setShowmenu(!showmenu);
                  }}
                >
                  <RiCloseLargeFill />
                </div>
              </div>
            ) : (
              <div
                className="text-3xl absolute cursor-pointer"
                onClick={() => {
                  setShowmenu(!showmenu);
                }}
              >
                <RxHamburgerMenu />
              </div>
            )}

            <div>
              <h1>Book Store</h1>
            </div>
            <div className="p-2 flex items-center gap-2">
              <button
                className="mr-5 cursor-pointer text-red-500"
                onClick={() => {
                  navigate(`/wishlist/${user_id}`);
                }}
              >
                <FaHeart />
              </button>
              <button
                onClick={() => {
                  navigate(`/cart/${user_id}`);
                }}
              >
                <FaCartShopping />
              </button>
              <div className="text-red-700">{amount}</div>
            </div>
          </div>
        </header>
        <div>
          <input
            type="text"
            placeholder="Search For Book"
            className="py-1 px-3 border-1 rounded-sm"
          />
        </div>
        <div className="flex gap-10">
          {loading ? null : (
            <div className="flex gap-10">
              {loading ? null : (
                <>
                  {books.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      setRefresh={setRefresh}
                    />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PC */}
      <div className="hidden sm:block">
        <header className="flex w-[100vw] bg-blue-300 py-3">
          <div className="flex w-full justify-between">
            {showmenu ? (
              <div className="flex absolute">
                <Menu />
                <div
                  className="text-3xl cursor-pointer"
                  onClick={() => {
                    setShowmenu(!showmenu);
                  }}
                >
                  <RiCloseLargeFill />
                </div>
              </div>
            ) : (
              <div
                className="text-3xl absolute cursor-pointer"
                onClick={() => {
                  setShowmenu(!showmenu);
                }}
              >
                <RxHamburgerMenu />
              </div>
            )}
            <div className="ml-20 flex items-center gap-2">
              <input
                type="text"
                placeholder="Search For Book"
                className="py-1 px-3 border-1 rounded-sm"
              />
              <button className="hover:cursor-pointer">
                <GoSearch className="text-2xl" />
              </button>
            </div>
            <div>
              <h1>Book Store</h1>
            </div>
            <div className="p-2 flex items-center gap-2 text-2xl">
              <button
                className="mr-5 cursor-pointer text-red-500"
                onClick={() => {
                  navigate(`/wishlist/${user_id}`);
                }}
              >
                <FaHeart />
              </button>
              <button
                className="cursor-pointer"
                onClick={() => {
                  navigate(`/cart/${user_id}`);
                }}
              >
                <FaCartShopping />
              </button>

              <div className="text-red-700">{amount}</div>
            </div>
          </div>
        </header>
        <div className="flex gap-5">
          {loading
            ? null
            : books.map((book) => {
                return (
                  <BookCard key={book.id} book={book} setRefresh={setRefresh} />
                );
              })}
        </div>
      </div>
    </>
  );
};

export default Homepage;
