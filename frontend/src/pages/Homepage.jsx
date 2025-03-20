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
  const [pop, setPop] = useState([]);

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

    axios.get(`${url}/books/popular`).then((res) => {
      setPop(res.data);
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

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("user_id");
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <ToastContainer autoClose={1500} closeOnClick />
      <div>
        {/* Mobile header */}
        <div className="sm:hidden">
          <header className="fixed w-full bg-gradient-to-r from-blue-500 to-blue-700 shadow-md py-3 pr-4 text-white flex items-center justify-between">
            {/* Menu Toggle */}
            <div>
              {showmenu ? (
                <div className="flex absolute top-0">
                  <Menu />
                  <div
                    className="text-3xl cursor-pointer ml-2 text-black hover:text-gray-500 transition-all"
                    onClick={() => setShowmenu(!showmenu)}
                  >
                    <RiCloseLargeFill />
                  </div>
                </div>
              ) : (
                <div
                  className="text-3xl cursor-pointer hover:text-gray-300 transition-all"
                  onClick={() => setShowmenu(!showmenu)}
                >
                  <RxHamburgerMenu />
                </div>
              )}
            </div>

            {/* Branding */}
            <div className="font-semibold tracking-wide flex-1 text-center">
              📚 Book Store
            </div>

            {/* User Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => logout()}
                className="bg-red-500 px-3 py-1 rounded-md text-white hover:bg-red-600 transition-all text-sm"
              >
                Logout
              </button>

              <button
                className="cursor-pointer text-red-400 hover:text-red-600 transition-all"
                onClick={() => navigate(`/wishlist/${user_id}`)}
              >
                <FaHeart size={22} />
              </button>

              <button
                className="relative cursor-pointer hover:text-gray-300 transition-all"
                onClick={() => navigate(`/cart/${user_id}`)}
              >
                <FaCartShopping size={22} />
                {amount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {amount}
                  </span>
                )}
              </button>
            </div>
          </header>
        </div>
        {/* PC Header */}
        <div className="hidden sm:block mb-2">
          <header className="top-0 flex w-full bg-gradient-to-r from-blue-500 to-blue-700 shadow-md py-4 pr-4 text-white max-h-[10vh] overflow-y-hidden">
            <div className="flex w-full justify-between items-center">
              {showmenu ? (
                <div className="flex absolute z-50 top-0">
                  <Menu />
                  <div
                    className="text-3xl cursor-pointer ml-4 text-black hover:text-gray-500 transition-all"
                    onClick={() => setShowmenu(!showmenu)}
                  >
                    <RiCloseLargeFill />
                  </div>
                </div>
              ) : (
                <div
                  className="text-3xl absolute top-4 cursor-pointer text-white hover:text-gray-300 transition-all"
                  onClick={() => setShowmenu(!showmenu)}
                >
                  <RxHamburgerMenu />
                </div>
              )}

              {/* Search Bar */}
              <div className="ml-20 flex items-center gap-2 bg-white rounded-lg">
                <input
                  type="text"
                  maxLength={50}
                  placeholder="Search for a book..."
                  className="py-2 px-4 w-72 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Branding */}
              <div className="text-2xl font-semibold tracking-wide">
                📚 Book Store
              </div>

              {/* User Controls */}
              <div className="flex items-center gap-4 text-lg">
                <button
                  onClick={() => logout()}
                  className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition-all cursor-pointer"
                >
                  Logout
                </button>

                <button
                  className="cursor-pointer text-red-400 hover:text-red-600 transition-all"
                  onClick={() => navigate(`/wishlist/${user_id}`)}
                >
                  <FaHeart size={28} />
                </button>

                <button
                  className="relative cursor-pointer hover:text-gray-300 transition-all"
                  onClick={() => navigate(`/cart/${user_id}`)}
                >
                  <FaCartShopping size={28} />
                  {amount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {amount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </header>
        </div>

        <div className="sm:flex block">
          <div className="flex w-[100vw] bg-white rounded-lg py-1 pt-[10vh] sm:hidden">
            <input
              type="text"
              placeholder="Search for a book..."
              className="py-2 px-4 mx-2 w-full text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Filter Component */}
          <div className="w-[100vw] sm:w-full sm:max-w-82">
            <Filter
              setSelectedCategory={setSelectedCategory}
              setSortOption={setSortOption}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
            />
          </div>

          {/* Display Books */}
          <div className="flex flex-col gap-8 sm:h-[88vh] h-[80vh] overflow-y-scroll">
            {/* Popular Books Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Popular Books
              </h2>
              <div className="grid grid-cols-2 sm:flex gap-5">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  pop.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      setRefresh={setRefresh}
                      selectedCategory={selectedCategory}
                      searchTerm={searchTerm}
                    />
                  ))
                )}
              </div>
            </div>

            {/* All Books Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                All Books
              </h2>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-5">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  filteredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      setRefresh={setRefresh}
                      selectedCategory={selectedCategory}
                      searchTerm={searchTerm}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
