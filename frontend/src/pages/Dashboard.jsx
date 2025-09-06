// src/pages/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { API_URL } from "../config";

export default function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState("");

  // Safely compute the primary email after Clerk is loaded
  const email = useMemo(() => {
    if (!isLoaded || !user) return undefined;
    // Prefer primary, fall back to the first email if needed
    return (
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      undefined
    );
  }, [isLoaded, user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isSignedIn || !email) return; // wait until we have email
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `${API_URL}/api/dashboard/by-email/${encodeURIComponent(email)}`
        );
        setPayload(res.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSignedIn, email]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Initializing...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const actions = payload?.actions || [];
  const currentPoints = payload?.currentPoints ?? 0;

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-24">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Activity</h1>
            <p className="text-gray-600">{email}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-600 text-sm">Total Reward Points</p>
            <p className="text-3xl font-extrabold text-green-600">{currentPoints}</p>
          </div>
        </header>

        {actions.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600">
            No actions found for your email.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  <th className="p-3">Photo</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Causes Solved</th>
                  <th className="p-3">Reward Points</th>
                  <th className="p-3">Added By</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={item.photoUrl}
                        alt={item.actorName}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                    </td>
                    <td className="p-3 font-semibold text-gray-800">{item.actorName}</td>
                    <td className="p-3 text-gray-600">{item.actorContact}</td>
                    <td className="p-3">{item.userAction}</td>
                    <td className="p-3">{item.causesSolved}</td>
                    <td className="p-3 font-bold text-green-600">{item.workpoints}</td>
                    <td className="p-3">
                      <div className="font-medium">{item.createdByName}</div>
                      <div className="text-xs text-gray-500">{item.createdByEmail}</div>
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
