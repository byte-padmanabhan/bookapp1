const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Book123 = require("./models/bookModel");
const books = require("./data/booksData");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Book123.deleteMany(); // Clear old data
    await Book123.insertMany(books); // Insert 20 books
    console.log(" Books added successfully!");
    process.exit();
  })
  .catch((err) => {
    console.log(" Error seeding books:", err);
    process.exit(1);
  });