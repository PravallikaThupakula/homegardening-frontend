import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import toast from "react-hot-toast";

const PLANT_RELATED_ITEMS = [
  { label: "Pots & planters", query: "pots planters" },
  { label: "Potting soil & mix", query: "potting soil" },
  { label: "Fertilizer", query: "plant fertilizer" },
  { label: "Pruning shear & garden tools", query: "pruning shear garden tools" },
  { label: "Watering can", query: "watering can" },
  { label: "Neem oil & pest control", query: "neem oil pest control" },
  { label: "Gardening gloves", query: "gardening gloves" },
  { label: "Plant care spray", query: "plant care spray" },
  { label: "Seeds", query: "seeds" },
  { label: "Grow bags & containers", query: "grow bags gardening" },
  { label: "Mulch & compost", query: "garden mulch compost" },
  { label: "Spray bottle", query: "spray bottle gardening" },
];

const buildSearchQuery = (plantName, itemQuery) => {
  const base = (plantName || "").trim() || "gardening";
  return `${base} ${itemQuery}`.trim();
};

const openFlipkart = (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`;
const openAmazon = (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`;
const openMeesho = (q) => `https://www.meesho.com/search?q=${encodeURIComponent(q)}`;
const openGoogle = (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`;

const ShoppingList = () => {
  const [plantName, setPlantName] = useState("");
  const [plantImage, setPlantImage] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    const name = (plantName || "").trim();
    if (!name && !plantImage) {
      toast.error("Enter a plant name or add an image");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setGenerated(true);
      setLoading(false);
      toast.success("Suggestions ready! Open any link to shop.");
    }, 400);
  };

  const searchQuery = (plantName || "").trim() || "gardening";

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🛒 Shopping List</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter a plant name or add an image to get garden equipment, pots, plant care products and more. Open in Flipkart, Amazon, Meesho or Google.
          </p>
        </div>

        {/* Generate by plant name / image */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold mb-3">Generate by plant</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Enter plant name (e.g. Rose, Tulsi, Tomato) or upload an image. We’ll suggest equipment, pots, pest control, and care products.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <input
              type="text"
              placeholder="e.g. Rose, Tulsi, Tomato, Money plant"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:border-green-500 focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">Or image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPlantImage(e.target.files?.[0] || null)}
                className="px-2 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-60"
            >
              {loading ? "Generating…" : "Generate suggestions"}
            </button>
          </div>
        </div>

        {/* Generated suggestions with Open in Flipkart, Amazon, Myntra, Meesho, Google */}
        {generated && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              For “{searchQuery}” – shop by category
            </h2>
            <div className="grid gap-4">
              {PLANT_RELATED_ITEMS.map((item, idx) => {
                const q = buildSearchQuery(plantName, item.query);
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl shadow"
                  >
                    <p className="font-medium mb-3">{item.label}</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={openFlipkart(q)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
                      >
                        Open in Flipkart
                      </a>
                      <a
                        href={openAmazon(q)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-600 text-white hover:bg-amber-700 transition text-sm"
                      >
                        Open in Amazon
                      </a>
                      <a
                        href={openMeesho(q)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition text-sm"
                      >
                        Open in Meesho
                      </a>
                      <a
                        href={openGoogle(q)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-700 text-white hover:bg-gray-800 transition text-sm"
                      >
                        Open in Google
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ShoppingList;
