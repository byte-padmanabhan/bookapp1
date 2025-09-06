import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { useUser } from "@clerk/clerk-react";
import { API_URL } from "../../config";

const CLOUD_NAME = "dmoykhwpa";
const UPLOAD_PRESET = "unsigned_upload";
const FOLDER_NAME = "image-admin";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export default function AdminDashboard() {
  const { user } = useUser(); // Admin (for audit trail)

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const [actorName, setActorName] = useState("");
  const [actorContact, setActorContact] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [userAction, setUserAction] = useState("");
  const [causesSolved, setCausesSolved] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      setPhotoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoFile) return alert("Please upload a photo");
    if (!actorName) return alert("Please enter the person's name");
    if (!user) return alert("You must be signed in as admin");

    setLoading(true);
    try {
      // 1) Upload image to Cloudinary
      const cdForm = new FormData();
      cdForm.append("file", photoFile);
      cdForm.append("upload_preset", UPLOAD_PRESET);
      cdForm.append("folder", FOLDER_NAME);

      const cdRes = await fetch(UPLOAD_URL, { method: "POST", body: cdForm });
      const cdData = await cdRes.json();
      if (!cdData.secure_url) throw new Error("Image upload failed");

      const photoUrl = cdData.secure_url;

      // 2) Payload
      const payload = {
        photoUrl,
        rewardPoints: Number(rewardPoints),
        userAction,
        causesSolved,
        actorName,
        actorContact,
        createdById: user.id,
        createdByName: user.fullName || "Unknown",
        createdByEmail: user.primaryEmailAddress?.emailAddress || "N/A",
      };

      // 3) Backend
      const backendRes = await fetch(`${API_URL}/api/admin-actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!backendRes.ok) throw new Error("Failed to save data in backend");
      alert(" Entry submitted successfully!");

      // Reset
      setPhotoFile(null);
      setPhotoPreview(null);
      setActorName("");
      setActorContact("");
      setRewardPoints("");
      setUserAction("");
      setCausesSolved("");
    } catch (err) {
      console.error(err);
      alert(" Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')",
      }}
    >
      

      {/* ✅ Form centered */}
      <div className="flex items-center justify-center p-6">
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-lg mt-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
            Admin Dashboard
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Person who did the action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Person’s Name (who did it)
                </label>
                <input
                  type="text"
                  value={actorName}
                  onChange={(e) => setActorName(e.target.value)}
                  placeholder="e.g., Ramesh Kumar"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Contact (phone or email)
                </label>
                <input
                  type="text"
                  value={actorContact}
                  onChange={(e) => setActorContact(e.target.value)}
                  placeholder="e.g., +91 98765 43210"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Upload Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="block w-full border border-gray-300 rounded-lg p-2"
              />
              {photoPreview && (
                <motion.img
                  src={photoPreview}
                  alt="Preview"
                  className="mt-4 w-32 h-32 object-cover rounded-xl shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </div>

            {/* Reward Points */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Reward Points
              </label>
              <input
                type="number"
                value={rewardPoints}
                onChange={(e) => setRewardPoints(e.target.value)}
                placeholder="Enter reward points"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            {/* What did they do? */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                What did the person do?
              </label>
              <textarea
                value={userAction}
                onChange={(e) => setUserAction(e.target.value)}
                placeholder="e.g., Collected and handed over 5kg of plastic waste at the shop."
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            {/* Causes Solved */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Cause(s) Impacted
              </label>
              <textarea
                value={causesSolved}
                onChange={(e) => setCausesSolved(e.target.value)}
                placeholder="e.g., Reducing plastic waste; promoting recycling."
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full ${
                loading ? "bg-gray-400" : "bg-green-600"
              } text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-700 transition`}
            >
              {loading ? "Uploading..." : "Submit"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
