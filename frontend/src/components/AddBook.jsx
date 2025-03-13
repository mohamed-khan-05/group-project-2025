import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBook = ({ refreshBooks, closeModal }) => {
  const url = import.meta.env.VITE_BASE_URL;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !author || !category || !quantity || !price) {
      return toast.error("Please fill in all required fields.");
    }

    const formatCategory = (category) => {
      return category
        .split(",")
        .map((cat) => cat.trim().toLowerCase())
        .join(", ");
    };
    const formattedCategory = formatCategory(category);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("author", author);
    formData.append("category", formattedCategory);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("discount", discount || "0");

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.post(`${url}/books/addbook`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "200") {
        toast.success("Book added successfully!");
        refreshBooks();
        closeModal();

        setTitle("");
        setDescription("");
        setAuthor("");
        setCategory("");
        setQuantity("");
        setPrice("");
        setDiscount("");
        setImageFile(null);
      } else {
        toast.error("Failed to add book.");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("Error adding book. Please check the console.");
    }
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4">Add Book</h2>
      <form
        className="flex flex-col gap-3 overflow-y-auto"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Discount"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="file"
          onChange={handleImageChange}
          className="border p-2 rounded"
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Book
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
