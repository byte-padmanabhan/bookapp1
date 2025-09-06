
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard.jsx";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      

      {/* Hero Section */}
      <section className="pt-28 pb-20 px-6 md:px-16 bg-gradient-to-r from-green-100 via-white to-green-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-6 max-w-xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Buy Books. Save the Planet.
            </h1>
            <p className="text-lg text-gray-600">
              Earn eco-credits by recycling plastics at registered stores and
              redeem them for discounts or even free books. Support local
              bookstores while making an impact.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition">
                Start Recycling
              </button>
              <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                Browse Books
              </button>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png"
            alt="Eco Illustration"
            className="w-80 md:w-[28rem]"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          How EcoReads Works
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {/* Step 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-green-50 p-8 rounded-2xl shadow-lg"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png"
              alt="Collect Plastics"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Collect Plastics</h3>
            <p className="text-gray-600">
              Gather plastic waste and drop it off at any registered recycling
              partner near you.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-green-50 p-8 rounded-2xl shadow-lg"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1029/1029183.png"
              alt="Earn Credits"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Earn Eco-Credits</h3>
            <p className="text-gray-600">
              Get reward points for each kilo of plastic, tracked in your
              dashboard.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-green-50 p-8 rounded-2xl shadow-lg"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2232/2232692.png"
              alt="Redeem Books"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Redeem Books</h3>
            <p className="text-gray-600">
              Use your eco-credits to buy books at huge discounts or get them for
              free.
            </p>
          </motion.div>
        </div>
      </section>

      

      {/* BookCard Section */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Popular Books
        </h2>
        <div className="max-w-6xl mx-auto">
          <BookCard />
        </div>
      </section>
    </div>
  );
}
