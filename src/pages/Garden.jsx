import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import toast from "react-hot-toast";
import XPBlast from "../components/XPBlast";
import Confetti from "../components/Confetti";
import { AuthContext } from "../context/AuthContext";

const GOOD_HEALTH = new Set([
  "Healthy", "Thriving", "Flourishing", "Vibrant", "Lush",
  "Active Growth", "Well-Watered", "Nutrient Balanced", "Pest-Free", "Disease-Free",
]);

const Garden = () => {
  const { refreshUser } = useContext(AuthContext);
  const [plants, setPlants] = useState([]);
  const [plantName, setPlantName] = useState("");
  const [plantImage, setPlantImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBlast, setShowBlast] = useState(false);
  const [blastMessage, setBlastMessage] = useState("+5 XP for watering!");
  const [showConfetti, setShowConfetti] = useState(false);
  const [adding, setAdding] = useState(false);
  const [rescanPlantId, setRescanPlantId] = useState(null);
  const [rescanImage, setRescanImage] = useState(null);
  const [rescanning, setRescanning] = useState(false);

  const fetchPlants = async () => {
    try {
      const res = await API.get("/garden");
      setPlants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const handleAddPlant = async (e) => {
    e.preventDefault();
    if (!plantName.trim()) {
      toast.error("Enter plant name");
      return;
    }
    if (!plantImage) {
      toast.error("Plant photo is required");
      return;
    }
    setAdding(true);
    try {
      const formData = new FormData();
      formData.append("plant_name", plantName.trim());
      formData.append("watering_frequency", "2");
      formData.append("image", plantImage);
      await API.post("/garden", formData);
      toast.success("Plant added 🌿 +10 XP");
      setPlantName("");
      setPlantImage(null);
      setShowModal(false);
      fetchPlants();
      refreshUser();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Could not add plant");
    } finally {
      setAdding(false);
    }
  };

  const handleWater = async (id) => {
    try {
      await API.put(`/garden/water/${id}`);
      setBlastMessage("+5 XP for watering!");
      setShowBlast(true);
      setShowConfetti(true);
      fetchPlants();
      refreshUser();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/garden/${id}`);
      toast.success("Plant deleted 🗑");
      fetchPlants();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRescan = async (e) => {
    e.preventDefault();
    if (!rescanPlantId || !rescanImage) {
      toast.error("Choose a new photo to re-scan");
      return;
    }
    setRescanning(true);
    try {
      const formData = new FormData();
      formData.append("image", rescanImage);
      const res = await API.put(`/garden/${rescanPlantId}/rescan`, formData);
      const points = res.data?.growth_points ?? 0;
      if (points > 0) {
        setBlastMessage(`+${points} Growth Points 🌟`);
        setShowBlast(true);
        setShowConfetti(true);
      }
      toast.success(points > 0 ? "Plant looks great! +10 Growth Points 🌟" : "Re-scanned. Keep caring for your plant!");
      setRescanPlantId(null);
      setRescanImage(null);
      fetchPlants();
      if (points > 0) refreshUser();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Re-scan failed");
    } finally {
      setRescanning(false);
    }
  };

  const getWaterStatus = (lastWatered, frequency) => {
    if (!lastWatered) return "needs";
    const today = new Date();
    const wateredDate = new Date(lastWatered);
    const diffDays = Math.floor((today - wateredDate) / (1000 * 60 * 60 * 24));
    if (diffDays <= frequency - 1) return "good";
    if (diffDays === frequency) return "soon";
    return "needs";
  };

  const isHealthy = (plant) => plant.health_status && GOOD_HEALTH.has(plant.health_status);

  return (
    <DashboardLayout>
      {showBlast && <XPBlast message={blastMessage} onDone={() => setShowBlast(false)} />}
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">🌿 My Garden</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
          >
            + Add Plant
          </button>
        </div>

        {/* Add Plant Modal — name + image required */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4">Add Plant</h2>
              <form onSubmit={handleAddPlant} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plant name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Monstera, Tomato, Basil"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plant photo * (we’ll scan health)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPlantImage(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:border-green-500 focus:outline-none text-sm"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={adding} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-60">
                    {adding ? "Adding…" : "Add"}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2.5 rounded-xl">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Rescan modal */}
        {rescanPlantId != null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4">Re-scan plant</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Upload a new photo to check growth and earn +10 Growth Points if it looks healthy.</p>
              <form onSubmit={handleRescan} className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setRescanImage(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm"
                />
                <div className="flex gap-3">
                  <button type="submit" disabled={rescanning || !rescanImage} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-60">
                    {rescanning ? "Scanning…" : "Re-scan"}
                  </button>
                  <button type="button" onClick={() => { setRescanPlantId(null); setRescanImage(null); }} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2.5 rounded-xl">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {plants.map((plant) => {
            const waterStatus = getWaterStatus(plant.last_watered, plant.watering_frequency);
            const healthy = isHealthy(plant);

            return (
              <div
                key={plant.id}
                className="p-6 rounded-3xl shadow-xl border"
                style={{ backgroundColor: "var(--bg-card)", color: "var(--text-primary)", borderColor: "var(--border-color)" }}
              >
                {/* Image required — placeholder if missing for legacy data */}
                <div className="relative rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800/60 h-40">
                  {plant.image_url ? (
                    <img
                      src={plant.image_url}
                      alt={plant.growth_notes || "Plant"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-5xl">
                      🌱
                    </div>
                  )}
                  {healthy && (
                    <span className="absolute top-2 right-2 text-2xl animate-sparkle" title="Healthy plant">✨</span>
                  )}
                </div>

                <h2 className="text-xl font-semibold mb-2">{plant.growth_notes || "Unnamed plant"}</h2>

                {/* Health status: green badge ✅, sparkle, +10 Growth Points when good */}
                <div className="mb-3">
                  {plant.health_status ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${healthy
                            ? "bg-green-100 text-green-800 dark:bg-green-800/40 dark:text-green-300 dark:border dark:border-green-500/30"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-800/40 dark:text-amber-300 dark:border dark:border-amber-500/30"
                          }`}
                      >
                        {healthy ? "✅" : ""} {plant.health_status}
                      </span>
                      {healthy && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                          +10 Growth Points 🌟
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      No scan yet — re-upload photo to scan
                    </span>
                  )}
                </div>

                <div className="space-y-1 mb-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    💧 Water every {plant.watering_frequency} days
                  </p>
                  {plant.sunlight_requirement && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">☀️ {String(plant.sunlight_requirement).replace(/_/g, " ")}</p>
                  )}
                </div>

                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${waterStatus === "good" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : waterStatus === "soon" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}>
                  {waterStatus === "good" ? "✓ Watered" : waterStatus === "soon" ? "⚠ Needs water soon" : "🔴 Needs water"}
                </div>

                {plant.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{plant.notes}</p>
                )}

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => handleWater(plant.id)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition text-sm font-medium"
                  >
                    💧 Water
                  </button>
                  <button
                    onClick={() => setRescanPlantId(plant.id)}
                    className="px-3 py-2 rounded-xl border-2 border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition text-sm"
                    title="Re-upload photo to scan growth"
                  >
                    📷
                  </button>
                  <button
                    onClick={() => handleDelete(plant.id)}
                    className="p-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
                    title="Delete plant"
                    aria-label="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Garden;
