import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../App";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const categories = [
  "Accounting and Informatics",
  "Applied Sciences",
  "Arts & Design",
  "Engineering & Built Environment",
  "Health Sciences",
  "Management Sciences",
];

const AdminBookDetails = () => {
  const url = import.meta.env.VITE_BASE_URL;
  const user_id = useContext(Context);
  const navigate = useNavigate();
  const { bookid } = useParams();

  const [book, setBook] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    category: "",
    quantity: "",
    price: "",
    discount: "",
    image: "",
  });

  useEffect(() => {
    axios
      .post(`${url}/books/getbookdetails`, { book_id: bookid })
      .then((res) => {
        setBook(res.data.book);
        setFormData({
          title: res.data.book.title,
          description: res.data.book.description,
          author: res.data.book.author,
          category: res.data.book.category,
          quantity: res.data.book.quantity,
          price: res.data.book.price,
          discount: res.data.book.discount,
          image: res.data.book.image,
        });
      });
  }, [bookid]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.author.trim()) newErrors.author = "Author is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.quantity || formData.quantity <= 0)
      newErrors.quantity = "Quantity must be at least 1.";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price must be greater than 0.";
    if (formData.discount < 0 || formData.discount > 100)
      newErrors.discount = "Discount must be between 0 and 100.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const form = new FormData();
    form.append("book_id", bookid);
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("author", formData.author);
    form.append("category", formData.category);
    form.append("quantity", formData.quantity);
    form.append("price", formData.price);
    form.append("discount", formData.discount);

    if (imageFile) {
      form.append("image", imageFile);
    }

    try {
      const res = await axios.post(`${url}/books/editbook`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.status === "200") {
        toast.success("Book updated successfully!");
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      }
    } catch (error) {
      toast.error("Error updating book");
      console.error("Error updating book:", error);
    }
  };

  return (
    <>
      <ToastContainer hideProgressBar />
      <div className="p-4">
        <button onClick={() => navigate(-1)}>Back</button>
        <h1 className="text-2xl font-bold mb-4">Edit Book Details</h1>

        {!book ? (
          <div>Loading...</div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="w-[50vw] h-[50vh]">
              <img
                className="object-contain w-full h-full"
                src={formData.image}
                alt={formData.title}
              />
            </div>

            <label>Upload New Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border p-2"
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}

            <label>Author:</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="border p-2"
            />
            {errors.author && <p className="text-red-500">{errors.author}</p>}

            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border p-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500">{errors.category}</p>
            )}

            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2"
            ></textarea>
            {errors.description && (
              <p className="text-red-500">{errors.description}</p>
            )}

            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border p-2"
            />
            {errors.price && <p className="text-red-500">{errors.price}</p>}

            <label>Discount (%):</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="border p-2"
            />
            {errors.discount && (
              <p className="text-red-500">{errors.discount}</p>
            )}

            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="border p-2"
            />
            {errors.quantity && (
              <p className="text-red-500">{errors.quantity}</p>
            )}

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded mt-4"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default AdminBookDetails;
