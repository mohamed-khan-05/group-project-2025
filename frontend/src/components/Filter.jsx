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
    if (/^\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const handleReset = () => {
    setSelectedCategory("");
    setSortOption("");
    setMinPrice("");
    setMaxPrice("");

    // Reset input fields
    document.getElementById("category").value = "";
    document.getElementById("sort").value = "";
    document.getElementById("min-price").value = "";
    document.getElementById("max-price").value = "";
  };

  return (
    <div className="border p-3 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-2">Filter and Sort</h2>

      {/* Category Filter (Dropdown) */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Filter by Category</h3>
        <select
          id="category"
          className="border rounded p-2 w-full"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Filter by Price Range</h3>
        <div className="flex gap-2">
          <input
            id="min-price"
            type="text"
            placeholder="Min Price"
            className="border rounded p-2 w-full"
            onChange={(e) => handlePriceInput(e, setMinPrice)}
            value={minPrice}
          />
          <input
            id="max-price"
            type="text"
            placeholder="Max Price"
            className="border rounded p-2 w-full"
            onChange={(e) => handlePriceInput(e, setMaxPrice)}
            value={maxPrice}
          />
        </div>
      </div>

      {/* Sorting Options */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Sort by</h3>
        <select
          id="sort"
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded p-2 w-full"
          value={sortOption}
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
        className="bg-red-500 text-white px-4 py-2 rounded w-full mt-3 hover:bg-red-600"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default Filter;
