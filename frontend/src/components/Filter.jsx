import React, { useEffect, useState } from "react";
import axios from "axios";

const Filter = ({ setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    axios.get(`${url}/filter/getfilters`).then((res) => {
      setCategories(res.data.categories);
    });
  }, [url]);

  return (
    <div className="border p-3 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-2">Filter by Category</h2>
      <div className="flex flex-col gap-2">
        <label>
          <input
            type="radio"
            name="category"
            value=""
            onChange={() => setSelectedCategory("")}
            defaultChecked
          />
          All
        </label>
        {categories.map((category, index) => (
          <label key={index}>
            <input
              type="radio"
              name="category"
              value={category}
              onChange={() => setSelectedCategory(category.trim())}
            />
            {category}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filter;
