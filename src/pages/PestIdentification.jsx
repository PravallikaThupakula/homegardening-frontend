import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import toast from "react-hot-toast";

const PestIdentification = () => {
  const [pests, setPests] = useState([]);
  const [selectedPest, setSelectedPest] = useState(null);
  const [loading, setLoading] = useState(true);

  const [adviceQuery, setAdviceQuery] = useState("");
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [advice, setAdvice] = useState(null);

  useEffect(() => {
    fetchPests();
  }, []);

  const fetchPests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/pests");
      setPests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAskAdvice = async () => {
    const q = (adviceQuery || "").trim();
    if (!q) {
      toast.error("Describe the pest, symptoms, or plant problem");
      return;
    }
    try {
      setAdviceLoading(true);
      setAdvice(null);
      const res = await API.post("/ai/pest-advice", { query: q });
      setAdvice(res.data);
      toast.success("Here are your tips and solutions");
    } catch (err) {
      console.error(err);
    } finally {
      setAdviceLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🐛 Pest & Disease Identification</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Identify common pests and diseases and get AI-powered tips, solutions & medicines
          </p>
        </div>

        {/* Ask AI: pest name, symptoms, diseases → tips, solutions, medicines */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 md:p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold mb-2">💡 Get tips & solutions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Describe a pest name, symptoms, disease, or plant problem (e.g. &quot;yellow leaves&quot;, &quot;aphids on roses&quot;, &quot;white powder on leaves&quot;)
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. aphids, powdery mildew, leaves turning yellow..."
              value={adviceQuery}
              onChange={(e) => setAdviceQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAskAdvice()}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:border-red-500 focus:outline-none"
            />
            <button
              onClick={handleAskAdvice}
              disabled={adviceLoading}
              className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {adviceLoading ? "..." : "Get tips & medicines"}
            </button>
          </div>
          {advice && (
            <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl font-bold text-red-700 dark:text-red-400">{advice.name}</h3>
                {advice.source && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {advice.source === "openai" ? "AI" : advice.source === "database" ? "Database" : "Tips"}
                  </span>
                )}
              </div>
              {advice.symptoms && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">Symptoms</h4>
                  <p className="text-gray-800 dark:text-gray-200">{advice.symptoms}</p>
                </div>
              )}
              {advice.tips?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">Care tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-800 dark:text-gray-200">
                    {advice.tips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
              {advice.solutions?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">Solutions</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-800 dark:text-gray-200">
                    {advice.solutions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {advice.medicines?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">Medicines / products</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-800 dark:text-gray-200">
                    {advice.medicines.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pests List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {pests.map((pest) => (
                  <div
                    key={pest.id}
                    onClick={() => setSelectedPest(pest)}
                    className={`bg-white dark:bg-gray-900 border-2 p-6 rounded-3xl shadow-xl cursor-pointer transition-all hover:scale-105 ${
                      selectedPest?.id === pest.id
                        ? "border-red-500"
                        : "border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-2">{pest.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Affects: {pest.affected_plants}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                      {pest.symptoms}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-1">
            {selectedPest ? (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-xl sticky top-4">
                <h2 className="text-2xl font-bold mb-4">{selectedPest.name}</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Symptoms:</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedPest.symptoms}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Affected Plants:</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedPest.affected_plants}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Treatment:</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedPest.treatment}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Prevention:</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedPest.prevention}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-xl text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Select a pest to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PestIdentification;
