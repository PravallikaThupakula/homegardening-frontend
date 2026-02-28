import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import toast from "react-hot-toast";

const MOODS = [
  { value: "happy", emoji: "😊", label: "Happy" },
  { value: "hopeful", emoji: "🌿", label: "Hopeful" },
  { value: "proud", emoji: "😌", label: "Proud" },
  { value: "excited", emoji: "🤩", label: "Excited" },
  { value: "neutral", emoji: "😐", label: "Neutral" },
  { value: "worried", emoji: "😟", label: "Worried" },
];

const WEATHER = [
  { value: "sunny", emoji: "☀️" },
  { value: "cloudy", emoji: "☁️" },
  { value: "rainy", emoji: "🌧️" },
  { value: "windy", emoji: "💨" },
];

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("timeline");
  const [formData, setFormData] = useState({
    title: "",
    notes: "",
    mood: "happy",
    weather: "sunny",
    plant_id: null,
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [aiReflection, setAiReflection] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await API.get("/journal");
      setEntries(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("notes", formData.notes);
      formDataToSend.append("mood", formData.mood);
      formDataToSend.append("weather", formData.weather);
      if (formData.plant_id) formDataToSend.append("plant_id", formData.plant_id);
      if (formData.image) formDataToSend.append("image", formData.image);

      await API.post("/journal", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Journal entry created!");
      setShowModal(false);
      setFormData({ title: "", notes: "", mood: "happy", weather: "sunny", plant_id: null, image: null });
      setAiReflection("");
      fetchEntries();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAiReflection = async () => {
    if (!formData.notes.trim()) {
      toast.error("Write some notes first");
      return;
    }
    setLoadingAi(true);
    setAiReflection("");
    try {
      const res = await API.post("/journal/ai/reflection", { notes: formData.notes });
      setAiReflection(res.data?.reflection || "Keep nurturing your plants!");
    } catch (_) {
      setAiReflection("Your consistency is paying off. Keep it up!");
    } finally {
      setLoadingAi(false);
    }
  };

  const fetchAiMood = async () => {
    if (!formData.notes.trim()) {
      toast.error("Write some notes first");
      return;
    }
    setLoadingAi(true);
    try {
      const res = await API.post("/journal/ai/mood", { notes: formData.notes });
      setFormData((prev) => ({ ...prev, mood: res.data?.mood || prev.mood }));
    } catch (_) {}
    setLoadingAi(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await API.delete(`/journal/${id}`);
      toast.success("Entry deleted");
      fetchEntries();
    } catch (err) {
      console.error(err);
    }
  };

  const entriesThisMonth = entries.filter((e) => {
    const d = new Date(e.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const getMoodEmoji = (mood) => MOODS.find((m) => m.value === mood)?.emoji ?? "😊";
  const getWeatherEmoji = (w) => WEATHER.find((x) => x.value === w)?.emoji ?? "☀️";

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">📔 Plant Journal</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Document your journey. Get AI encouragement and track growth.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition shrink-0"
          >
            + New Entry
          </button>
        </div>

        {/* Growth indicator */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            📈 This month: <strong>{entriesThisMonth}</strong> entries
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-500">
            Total: <strong>{entries.length}</strong> entries
          </span>
        </div>

        {/* View toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${viewMode === "timeline" ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
          >
            📅 Timeline
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${viewMode === "grid" ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
          >
            Grid
          </button>
        </div>

        {/* Create Entry Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">New Journal Entry</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Entry title (e.g. Rose bush, First buds)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700 focus:border-green-500 focus:outline-none"
                  required
                />
                <textarea
                  placeholder="Notes and reflections... (try 'Get AI feedback' after writing)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-32 focus:border-green-500 focus:outline-none"
                  required
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={fetchAiReflection}
                    disabled={loadingAi}
                    className="text-sm text-green-600 dark:text-green-400 hover:underline"
                  >
                    {loadingAi ? "..." : "💡 Get AI feedback"}
                  </button>
                  <button
                    type="button"
                    onClick={fetchAiMood}
                    disabled={loadingAi}
                    className="text-sm text-green-600 dark:text-green-400 hover:underline"
                  >
                    {loadingAi ? "..." : "🎭 Detect mood from text"}
                  </button>
                </div>
                {aiReflection && (
                  <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">AI says:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{aiReflection}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium">Mood</label>
                    <select
                      value={formData.mood}
                      onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    >
                      {MOODS.map((m) => (
                        <option key={m.value} value={m.value}>{m.emoji} {m.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">Weather</label>
                    <select
                      value={formData.weather}
                      onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    >
                      {WEATHER.map((w) => (
                        <option key={w.value} value={w.value}>{w.emoji} {w.value}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Photo (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700">
                    Save Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setAiReflection(""); }}
                    className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Entries */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No journal entries yet. Start documenting your gardening journey!
            </p>
          </div>
        ) : viewMode === "timeline" ? (
          <div className="space-y-6 max-w-2xl">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden"
              >
                <div className="flex gap-4 p-6">
                  <div className="shrink-0 w-24 text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {new Date(entry.created_at).getDate()}
                    </p>
                    <p className="text-xs text-gray-500 uppercase">
                      {new Date(entry.created_at).toLocaleDateString("en", { month: "short" })}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    {entry.image_url && (
                      <img
                        src={entry.image_url}
                        alt={entry.title}
                        className="w-full h-40 object-cover rounded-xl mb-4"
                      />
                    )}
                    <h3 className="text-xl font-bold mb-2">{entry.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 whitespace-pre-wrap">{entry.notes}</p>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span title="mood">{getMoodEmoji(entry.mood)}</span>
                      <span title="weather">{getWeatherEmoji(entry.weather)}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all"
              >
                {entry.image_url && (
                  <img
                    src={entry.image_url}
                    alt={entry.title}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                )}
                <h3 className="text-xl font-bold mb-2">{entry.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{entry.notes}</p>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <span>{getMoodEmoji(entry.mood)}</span>
                    <span>{getWeatherEmoji(entry.weather)}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="w-full bg-red-500/10 text-red-600 dark:text-red-400 py-2 rounded-xl hover:bg-red-500/20 transition text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Journal;
