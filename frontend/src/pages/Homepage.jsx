import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "../components/Menu";
import { Context } from "../App";
import axios from "axios";

import BookCard from "../components/BookCard";
import Filter from "../components/Filter";

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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    if (!userid) {
      return;
    }

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

  const filteredBooks = books
    .filter((book) => {
      const matchesCategory =
        selectedCategory === "" || book.category.includes(selectedCategory);
      const matchesSearch =
        searchTerm === "" ||
        book.title.toLowerCase().includes(searchTerm.toLowerCase());

      const bookPrice = book.price ? parseFloat(book.price) : 0;
      const minPriceNum = minPrice ? parseFloat(minPrice) : 0;
      const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;
      const matchesPrice = bookPrice >= minPriceNum && bookPrice <= maxPriceNum;

      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortOption === "name-asc") return a.title.localeCompare(b.title);
      if (sortOption === "name-desc") return b.title.localeCompare(a.title);
      if (sortOption === "category-asc")
        return a.category.localeCompare(b.category);
      if (sortOption === "category-desc")
        return b.category.localeCompare(a.category);
      return 0;
    });

  return (
    <>
      <ToastContainer autoClose={1500} closeOnClick />
      {/* PC */}
      <div>
        <header className="flex w-[100vw] bg-blue-300 py-3">
          <div className="flex w-full justify-between">
            {showmenu ? (
              <div className="flex absolute">
                <Menu />
                <div
                  className="text-3xl cursor-pointer"
                  onClick={() => setShowmenu(!showmenu)}
                >
                  <RiCloseLargeFill />
                </div>
              </div>
            ) : (
              <div
                className="text-3xl absolute cursor-pointer"
                onClick={() => setShowmenu(!showmenu)}
              >
                <RxHamburgerMenu />
              </div>
            )}
            <div className="ml-20 flex items-center gap-2">
              <input
                type="text"
                placeholder="Search For Book"
                className="py-1 px-3 border rounded-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <h1>Book Store</h1>
            </div>
            <div className="p-2 flex items-center gap-2 text-2xl">
              <button
                className="mr-5 cursor-pointer text-red-500"
                onClick={() => navigate(`/wishlist/${user_id}`)}
              >
                <FaHeart />
              </button>
              <button
                className="cursor-pointer"
                onClick={() => navigate(`/cart/${user_id}`)}
              >
                <FaCartShopping />
              </button>
              <div className="text-red-700">{amount}</div>
            </div>
          </div>
        </header>

        <div className="sm:flex block">
          {/* Filter Component */}
          <div>
            <Filter
              setSelectedCategory={setSelectedCategory}
              setSortOption={setSortOption}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
            />
          </div>

          {/* Display Books */}
          <div className="flex gap-5 flex-wrap">
            {loading
              ? null
              : filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    setRefresh={setRefresh}
                    selectedCategory={selectedCategory}
                    searchTerm={searchTerm}
                  />
                ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
