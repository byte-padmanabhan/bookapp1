import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

export default function BooksPage() {
  const { isSignedIn, user } = useUser();
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  // Fetch books from backend
  useEffect(() => {
    fetch(`${API_URL}/api/books`)
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  
  const addToCart = async (book) => {
    if (!isSignedIn) {
      alert("Please log in to add books to your cart.");
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const clerkUserId = user.id; // Clerk's unique user ID

      await axios.post(`${API_URL}/api/cart/add`, {
        userId: clerkUserId,
        bookId: book._id,
        title: book.title,    
        price: book.price,     
        image: book.image,     
        quantity: 1,   
      });

      alert(`"${book.title}" has been added to your cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add book to cart.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6 md:px-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
        Browse All Books
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {books.map((book) => (
          <motion.div
            key={book._id}
            className="bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-between"
            whileHover={{ scale: 1.03 }}
          >
            {/* Book Image */}
            <div
              onClick={() => navigate(`/books/${book._id}`)}
              className="cursor-pointer"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-60 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {book.title}
              </h2>
              <p className="text-gray-600 mb-2">{book.author}</p>
            </div>

            {/* Book Price */}
            {isSignedIn ? (
              <p className="text-green-600 font-bold text-lg mb-4">
                ₹{book.price}
              </p>
            ) : (
              <p className="text-gray-500 italic mb-4">Login to view price</p>
            )}

            {/* Add to Cart Button */}
            <button
              disabled={!isSignedIn}
              onClick={() => addToCart(book)}
              className={`w-full py-2 rounded-lg transition ${
                isSignedIn
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
