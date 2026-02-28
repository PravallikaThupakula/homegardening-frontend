import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import toast from "react-hot-toast";

const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "fall";
  return "winter";
};

const SeasonalTips = () => {
  const [tips, setTips] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(getCurrentSeason());
  const [placeQuery, setPlaceQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchedPlace, setSearchedPlace] = useState("");

  const fetchTipsByPlace = async () => {
    const place = (placeQuery || "").trim();
    if (!place) {
      toast.error("Enter a place (village, region, district, or country)");
      return;
    }
    try {
      setLoading(true);
      setSearchedPlace(place);
      const res = await API.get(
        `/seasonal-tips/by-place?place=${encodeURIComponent(place)}&season=${selectedSeason}`
      );
      setTips(Array.isArray(res.data) ? res.data : []);
      if ((res.data || []).length > 0) {
        toast.success(`Tips for ${place}`);
      }
    } catch (err) {
      console.error(err);
      setTips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!placeQuery.trim()) {
      setLoading(true);
      let url = "/seasonal-tips?";
      if (selectedSeason) url += `season=${selectedSeason}`;
      API.get(url)
        .then((res) => setTips(res.data || []))
        .catch((err) => {
          setTips([]);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedSeason]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🍂 Seasonal Gardening Tips</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search by place (village, region, district, country) for tips tailored to your location
          </p>
        </div>

        {/* Place search + season */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Village, region, district or country (e.g. Mumbai, Texas, Kerala, Japan)"
              value={placeQuery}
              onChange={(e) => setPlaceQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchTipsByPlace()}
              className="flex-1 min-w-[200px] p-3 rounded-xl border-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700 focus:border-green-500 focus:outline-none"
            />
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="p-3 rounded-xl border-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="spring">🌸 Spring</option>
              <option value="summer">☀️ Summer</option>
              <option value="fall">🍂 Fall</option>
              <option value="winter">❄️ Winter</option>
            </select>
            <button
              type="button"
              onClick={fetchTipsByPlace}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-60"
            >
              {loading ? "..." : "Get tips for this place"}
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Tips are generated for your place and current season. Try any location name.
          </p>
        </div>

        {/* Tips Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {searchedPlace && (
              <p className="md:col-span-2 text-sm text-gray-500 dark:text-gray-400">
                Tips for <strong>{searchedPlace}</strong> — {selectedSeason}
              </p>
            )}
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{tip.title}</h3>
                  <span className="text-sm bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full capitalize">
                    {tip.season || selectedSeason}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{tip.content}</p>
                {tip.regions && tip.regions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Suitable for:</p>
                    <div className="flex flex-wrap gap-2">
                      {tip.regions.map((region, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {tip.plant_types && tip.plant_types.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Plant types:</p>
                    <div className="flex flex-wrap gap-2">
                      {tip.plant_types.map((type, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SeasonalTips;
