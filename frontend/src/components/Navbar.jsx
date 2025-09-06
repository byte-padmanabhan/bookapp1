import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  useUser,
} from "@clerk/clerk-react";
import { FiShoppingCart } from "react-icons/fi"; 

function Navbar() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          MyLibrary
        </Link>

        {/* Nav Links */}
        <div className="flex items-center space-x-6">
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600">
                Admin Dashboard
              </Link>
              <Link to="/admin/manage" className="text-gray-700 hover:text-blue-600">
                Manage Books
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link to="/books" className="text-gray-700 hover:text-blue-600">
                Books
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600">
                Contact
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600">
                About Us
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>

              {/*  Cart Icon */}
              <Link to="/cart" className="text-gray-700 hover:text-blue-600 relative">
                <FiShoppingCart size={24} />
                {/* Optional: add badge for number of items */}
                {/* <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">3</span> */}
              </Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div>
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Login
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
