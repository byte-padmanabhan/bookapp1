const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Book = require("./models/bookModel");
const Cart = require("./models/cartModel");
const User = require("./models/userdetails");
const AdminAction = require("./models/adminData");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* -------------------------------------------------------------------------- */
/*                                USER PROFILE                                */
/* -------------------------------------------------------------------------- */
app.post("/profiledetails", async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email )
      return res.status(400).json({ message: "Email & Clerk ID required" });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || "",
        email,
        phno: null,
        totalreward: 0,
        profilecomplete: false,
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------------------------------------- */
/*                                 ADMIN DATA                                 */
/* -------------------------------------------------------------------------- */
app.post("/api/admin-actions", async (req, res) => {
  try {
    const {
      photoUrl,
      rewardPoints,
      userAction,
      causesSolved,
      actorName,
      actorContact,
      createdById,
      createdByName,
      createdByEmail,
    } = req.body;

    if (!photoUrl || !actorName || !rewardPoints || !userAction || !causesSolved || !createdById) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newAction = await AdminAction.create({
      photoUrl,
      rewardPoints,
      userAction,
      causesSolved,
      actorName,
      actorContact,
      createdById,
      createdByName,
      createdByEmail,
    });

    const user = await User.findOne({ email: actorContact });
    if (user) {
      user.totalreward += Number(rewardPoints);
      await user.save();
    }

    res.status(201).json({
      message: "Admin action saved & reward updated",
      data: newAction,
      updatedReward: user ? user.totalreward : null,
    });
  } catch (err) {
    console.error("Error saving admin action:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                                BOOK ROUTES                                 */
/* -------------------------------------------------------------------------- */
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------------------------------------- */
/*                                CART ROUTES                                 */
/* -------------------------------------------------------------------------- */

// ✅ Add item to cart
app.post("/api/cart/add", async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    if (!userId || !bookId) return res.status(400).json({ message: "Missing fields" });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingItem = cart.items.find((item) => item.bookId.toString() === bookId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        bookId: book._id,
        title: book.title,
        image: book.image,
        price: book.price,
        quantity: 1,
      });
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Get cart items + rewards
app.get("/api/cart/:userId/:email", async (req, res) => {
  try {
    const { userId ,email} = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.json({ items: [], totalPrice: 0, discount: 0, finalPrice: 0 });
    }

    const user = await User.findOne({ email:email});
    const rewardPoints = user ? user.totalreward : 0;

    const discount = Math.min(rewardPoints, cart.totalPrice);
    const finalPrice = cart.totalPrice - discount;

    res.json({
      ...cart.toObject(),
      discount,
      finalPrice,
      rewardPoints,
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Remove item from cart
app.delete("/api/cart/remove/:userId/:bookId", async (req, res) => {
  try {
    const { userId, bookId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.bookId.toString() !== bookId);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Checkout & reset rewards
app.post("/api/cart/checkout/:email", async (req, res) => {
  try {
    const { userId } = req.body;
    const {email}=req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const user = await User.findOne({ email });
    if (user) {
      user.totalreward = 0;
      await user.save();
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.json({ message: "Checkout successful", items: [], totalPrice: 0, discount: 0, finalPrice: 0 });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
app.get("/api/dashboard/by-email/:email", async (req, res) => {
  try {
    // normalize and decode the email passed from the frontend
    const emailRaw = req.params.email || "";
    const email = decodeURIComponent(emailRaw).toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the user once
    const user = await User.findOne({ email });
    const currentPoints = user ? user.totalreward : 0;

    // Find actions for this email
    const actions = await AdminAction
      .find({ actorContact: email })
      .sort({ createdAt: -1 });

    // Build response rows (each row gets the user's current rewardPoints)
    const rows = actions.map((a) => ({
      _id: a._id,
      photoUrl: a.photoUrl,
      actorName: a.actorName,
      actorContact: a.actorContact,
      userAction: a.userAction,
      causesSolved: a.causesSolved,
      createdByName: a.createdByName,
      createdByEmail: a.createdByEmail,
      createdAt: a.createdAt,
      currentPoints,
      workpoints:a.rewardPoints// current total reward points for this email
    }));

    return res.json({
      email,
      currentPoints,
      count: rows.length,
      actions: rows,
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
