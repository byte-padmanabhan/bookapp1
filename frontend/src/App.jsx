import { Routes, Route, Link } from "react-router-dom";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BooksPage from "./pages/Bookspage";
import CartPage from "./pages/CartPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/adminpages/AdminDashboard";
export default function App() {
  return (
    <div>
     
      
      <Navbar/>
        <Routes>
      <Route path="/contact" element={<Contact />} />
       <Route path="/about" element={<AboutUs/>} />
       <Route path="/" element={<Home/>} />
       <Route path="/books" element={<BooksPage/>} />
       <Route path="/cart" element={<CartPage/>} />
       <Route path="/dashboard" element={<Dashboard />} />
       
      
       
       
       

      </Routes>
    </div>
  );
}


