import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function CartPage() {
  const { isSignedIn, user } = useUser();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const email =  user?.primaryEmailAddress?.emailAddress;
  // Fetch cart items
  useEffect(() => {
    if (!isSignedIn || !user?.id) return;

    const fetchCart = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/cart/${user.id}/${email}`);
        setCart(res.data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isSignedIn, user]);

  // Remove item from cart
  const handleRemove = async (bookId) => {
    try {
      const res = await axios.delete(
        `${API_URL}/api/cart/remove/${user.id}/${bookId}`
      );
      setCart(res.data);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // Checkout
  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return alert("Cart is empty!");
    if (!window.confirm("Are you sure you want to checkout?")) return;

    try {
      const res = await axios.post(`${API_URL}/api/cart/checkout/${email}`, {
        userId: user.id
      });
      setCart(res.data);
      alert("Checkout successful! 🎉 Your reward points are now reset to 0.");
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view your cart.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6 md:px-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
        Your Cart
      </h1>

      {!cart || cart.items.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {cart.items.map((item) => (
            <div
              key={item.bookId}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-28 object-cover rounded-lg"
                />
                <div>
                  <h2 className="font-semibold text-lg">{item.title}</h2>
                  <p className="text-gray-700 font-bold mt-1">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <p className="font-bold text-lg">
                  ₹{item.price * item.quantity}
                </p>
                <button
                  className="text-red-600 hover:text-red-800 font-semibold"
                  onClick={() => handleRemove(item.bookId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Price Summary */}
          <div className="bg-white p-4 rounded-xl shadow space-y-2">
            <div className="flex justify-between text-lg">
              <span>Subtotal:</span>
              <span>₹{cart.totalPrice}</span>
            </div>
            <div className="flex justify-between text-lg text-blue-600">
              <span>Discount ({cart.rewardPoints} pts):</span>
              <span>-₹{cart.discount}</span>
            </div>
            <div className="flex justify-between font-bold text-xl">
              <span>Total Payable:</span>
              <span>₹{cart.finalPrice}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
