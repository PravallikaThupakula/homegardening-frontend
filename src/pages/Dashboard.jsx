import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalPlants: 0,
    needsWater: 0,
    plantsToWaterToday: [],
    xp: 0,
    streak: 0,
    level: 0,
    progress: 0,
    xpPerLevel: 200,
    wateringWeekly: [],
  });
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await API.get("/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAISuggestions = async () => {
    try {
      const res = await API.get("/ai/suggestions");
      setAiSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAISuggestions();
  }, []);

  const handleWater = async (id) => {
    try {
      await API.put(`/garden/water/${id}`);
      toast.success("Plant watered 💧 +5 XP");
      fetchStats();
      refreshUser();
    } catch (err) {
      console.error(err);
    }
  };

  const userName = user?.user?.name || "Gardener";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-10 h-10 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Welcome back, {userName} 🌱
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here’s your garden at a glance. Water your plants to keep your streak and earn points.
          </p>
        </div>

        {/* Streaks & Points */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl shadow">
            <p className="text-sm text-gray-500 dark:text-gray-400">Points (XP)</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.xp}</p>
            <p className="text-xs text-gray-400 mt-1">+5 water · +10 share</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl shadow">
            <p className="text-sm text-gray-500 dark:text-gray-400">Streak</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.streak} days</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl shadow">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total plants</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalPlants}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl shadow">
            <p className="text-sm text-gray-500 dark:text-gray-400">Needs water</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.needsWater}</p>
          </div>
        </div>

        {/* Today's watering reminders */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Today’s watering reminders</h2>
          {!stats.plantsToWaterToday?.length ? (
            <p className="text-gray-500 dark:text-gray-400">All good for today 🎉</p>
          ) : (
            <div className="space-y-3">
              {stats.plantsToWaterToday.map((plant) => (
                <div
                  key={plant.id}
                  className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <div>
                    <p className="font-medium">{plant.growth_notes}</p>
                    <p className="text-sm text-gray-500">Every {plant.watering_frequency} days</p>
                  </div>
                  <button
                    onClick={() => handleWater(plant.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition text-sm"
                  >
                    💧 Water
                  </button>
                </div>
              ))}
            </div>
          )}
          <Link
            to="/plants"
            className="inline-block mt-3 text-sm font-medium text-green-600 dark:text-green-400 hover:underline"
          >
            Open My Garden →
          </Link>
        </div>

        {/* Weekly growth analytics */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Weekly growth analytics</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.wateringWeekly || []}>
                <XAxis dataKey="week" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="waterings" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI suggestions – daily plant tips from API */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-3">Daily AI suggestions</h2>
          {aiSuggestions.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">Keep watering on schedule. New tips will appear here based on your plants.</p>
          ) : (
            <div className="space-y-2">
              {aiSuggestions.slice(0, 3).map((s, i) => (
                <p key={i} className="text-sm">{s.message}</p>
              ))}
            </div>
          )}
        </div>

        {/* Share & challenges CTA */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">Share your progress</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Complete challenges and share your streak on WhatsApp, X, or Facebook from the Challenges page.
          </p>
          <Link
            to="/challenges"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition text-sm"
          >
            Go to Challenges →
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
