import React from "react";

const Filter = ({
  selectedCategory,
  setSelectedCategory,
  sortOption,
  setSortOption,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}) => {
  const categories = [
    "Accounting and Informatics",
    "Applied Sciences",
    "Arts & Design",
    "Engineering & Built Environment",
    "Health Sciences",
    "Management Sciences",
  ];

  const handlePriceInput = (e, setPrice) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const handleReset = () => {
    setSelectedCategory("");
    setSortOption("");
    setMinPrice("");
    setMaxPrice("");

    document.getElementById("category").value = "";
    document.getElementById("sort").value = "";
    document.getElementById("min-price").value = "";
    document.getElementById("max-price").value = "";
  };

  const handleKeyPress = (e) => {
    const key = e.key;
    if (!/[\d\.]/.test(key) && key !== "Backspace" && key !== "Delete") {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-white p-5 shadow-md rounded-lg border border-gray-200 w-full sm:max-w-72">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
        Filter & Sort
      </h2>

      {/* Category Filter */}
      <div className="mb-4">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category
        </label>
        <select
          id="category"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price Range
        </label>
        <div className="flex gap-2">
          <input
            id="min-price"
            onKeyDown={handleKeyPress}
            maxLength={10}
            type="text"
            placeholder="Min"
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 text-center"
            onChange={(e) => handlePriceInput(e, setMinPrice)}
            value={minPrice}
          />
          <input
            id="max-price"
            onKeyDown={handleKeyPress}
            maxLength={10}
            type="text"
            placeholder="Max"
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 text-center"
            onChange={(e) => handlePriceInput(e, setMaxPrice)}
            value={maxPrice}
          />
        </div>
      </div>

      {/* Sorting Options */}
      <div className="mb-4">
        <label
          htmlFor="sort"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Sort by
        </label>
        <select
          id="sort"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">None</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="category-asc">Category (A-Z)</option>
          <option value="category-desc">Category (Z-A)</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full bg-red-500 text-white font-medium py-2 rounded-md transition hover:bg-red-600"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default Filter;
