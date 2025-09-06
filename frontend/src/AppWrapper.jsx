import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./config";

function ProfileModal({ userData, onSubmit }) {
  const [form, setForm] = useState({
    name: userData?.name || "",
    phno: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="border rounded p-2 mb-3 w-full"
        />
        <input
          type="text"
          name="phno"
          placeholder="Phone Number"
          value={form.phno}
          onChange={handleChange}
          className="border rounded p-2 mb-3 w-full"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-lg w-full"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default function AppWrapper({ children }) {
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Skip AppWrapper logic on admin pages completely
  if (location.pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  useEffect(() => {
    if (user) {
      const userEmail = user.primaryEmailAddress.emailAddress;

      // ✅ If admin → don't show modal, skip API calls
      if (userEmail === "admin@gmail.com") {
        return;
      }

      axios
        .post(`${API_URL}/profiledetails`, {
          email: userEmail,
          name: user.fullName,
        })
        .then((res) => {
          setUserData(res.data);

          // ✅ Show modal only if profile is incomplete
          if (!res.data.profilecomplete) {
            setShowModal(true);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  const handleProfileSubmit = (form) => {
    axios
      .post(`${API_URL}/updateprofile`, {
        email: user.primaryEmailAddress.emailAddress,
        name: form.name,
        phno: form.phno,
      })
      .then((res) => {
        setUserData(res.data);
        setShowModal(false);
        navigate("/");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      {/* ✅ Show modal only for normal users */}
      {showModal && (
        <ProfileModal userData={userData} onSubmit={handleProfileSubmit} />
      )}
      {!showModal && children}
    </div>
  );
}
