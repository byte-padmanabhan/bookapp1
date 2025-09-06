import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-green-700 text-white py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.h1
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About Us
          </motion.h1>
          <motion.p
            className="text-lg max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            We're on a mission to make the world a better place by promoting
            <span className="font-semibold"> book recycling </span>, reducing
            pollution, and rewarding those who contribute towards a cleaner and
            greener future.
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Story
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We started this platform with a simple vision: <br />
              <span className="font-semibold">"Recycle books, save the planet."</span>  
              By enabling shop owners and students to reuse books, we aim to reduce
              waste and promote eco-friendly practices.  
              Every book you recycle contributes to a better environment and earns
              you <span className="font-bold">reward points</span> you can redeem for discounts.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Join thousands of students and shop owners who are already part of this
              movement. Together, we can build a sustainable future.
            </p>
          </motion.div>

          <motion.img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72"
            alt="Our Mission"
            className="rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          />
        </div>
      </section>

      {/* Our Work Gallery */}
      <section className="bg-gray-100 py-16 px-6 md:px-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
          Our Impact
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {[
            {
              img: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b",
              title: "Recycling Books",
            },
            {
              img: "https://images.unsplash.com/photo-1581091012184-5c2f18c7ef84",
              title: "Saving Trees",
            },
            {
              img: "https://images.unsplash.com/photo-1542831371-d531d36971e6",
              title: "Reducing Pollution",
            },
            {
              img: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
              title: "Rewarding Contributors",
            },
            {
              img: "https://images.unsplash.com/photo-1598103431589-e24f2d2e6b44",
              title: "Community Drives",
            },
            {
              img: "https://images.unsplash.com/photo-1473181488821-2d23949a045a",
              title: "Sustainable Future",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="rounded-xl overflow-hidden shadow-md bg-white"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-green-700 text-white text-center py-16 px-6 md:px-16">
        <h2 className="text-3xl font-bold mb-4">Be Part of the Change</h2>
        <p className="max-w-2xl mx-auto mb-6 text-lg">
          Together, we can save thousands of books, reduce waste, and make our
          planet greener. Start recycling today and earn exciting rewards!
        </p>
        <motion.a
          href="/books"
          className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 transition"
          whileHover={{ scale: 1.05 }}
        >
          Browse Books
        </motion.a>
      </section>
    </div>
  );
}
