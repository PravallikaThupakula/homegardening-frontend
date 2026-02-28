import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Confetti from "../components/Confetti";

const Challenges = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedXp, setCompletedXp] = useState(0);
  const [daily, setDaily] = useState([]);

  useEffect(() => {
    fetchChallenges();
    fetchUserChallenges();
    fetchLeaderboard();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await API.get("/challenges");
      const list = Array.isArray(res.data) ? res.data : [];
      const fallback =
        list.length > 0
          ? list
          : [
              { id: "f1", title: "Water 3 plants", description: "Give three plants a thorough watering today.", points: 5, difficulty: "easy" },
              { id: "f2", title: "Prune dead leaves", description: "Remove dead or yellowing foliage from two plants.", points: 5, difficulty: "easy" },
              { id: "f3", title: "Repot a root-bound plant", description: "Pick one plant that needs more space and repot it.", points: 15, difficulty: "medium" },
              { id: "f4", title: "Mulch around a plant", description: "Add a thin layer of organic mulch to retain moisture.", points: 10, difficulty: "medium" },
              { id: "f5", title: "Share a garden tip", description: "Post a helpful tip in the forum and inspire others.", points: 10, difficulty: "easy" },
            ];
      setChallenges(fallback);
      setDaily(pickDaily(fallback, 3));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserChallenges = async () => {
    try {
      const res = await API.get("/challenges/user");
      setUserChallenges(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get("/challenges/leaderboard");
      setLeaderboard(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      await API.post(`/challenges/${challengeId}/join`);
      toast.success("Challenge joined!");
      fetchUserChallenges();
      fetchChallenges();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProgress = async (challengeId, progress, status) => {
    try {
      await API.put(`/challenges/${challengeId}/progress`, { progress, status });
      const challenge = challenges.find((c) => c.id === challengeId) || userChallenges.find((uc) => uc.challenge_id === challengeId)?.challenge;
      const xp = challenge?.points ?? 0;
      if (status === "completed") {
        setCompletedXp(xp);
        setShowConfetti(true);
        toast.success(`Challenge complete! +${xp} XP 🎉`);
        fetchLeaderboard();
        refreshUser?.();
      } else {
        toast.success("Progress updated!");
      }
      fetchUserChallenges();
    } catch (err) {
      console.error(err);
    }
  };

  const isJoined = (challengeId) => {
    return userChallenges.some((uc) => uc.challenge_id === challengeId);
  };

  const getUserChallenge = (challengeId) => {
    return userChallenges.find((uc) => uc.challenge_id === challengeId);
  };

  const completedCount = userChallenges.filter((uc) => uc.status === "completed").length;
  const totalPoints = user?.user?.points ?? user?.user?.xp ?? 0;

  const badge =
    totalPoints >= 500
      ? { name: "Garden Legend", color: "bg-yellow-500", emoji: "👑" }
      : totalPoints >= 250
      ? { name: "Garden Pro", color: "bg-emerald-500", emoji: "🌳" }
      : totalPoints >= 100
      ? { name: "Budding Gardener", color: "bg-green-500", emoji: "🌼" }
      : { name: "Sprout Starter", color: "bg-lime-500", emoji: "🌱" };

  const weeklyChallenges =
    challenges.filter((c) => c.type === "weekly" || c.frequency === "weekly").length > 0
      ? challenges.filter((c) => c.type === "weekly" || c.frequency === "weekly")
      : challenges.slice(0, 3);

  const topTen = leaderboard.slice(0, 10);

  const shareText = encodeURIComponent(
    `I just took on gardening challenges in Home Gardening Assistant! 🌱🏆 My score: ${totalPoints} points. Join me and grow together!`
  );
  const appUrl = encodeURIComponent(window.location.origin);

  function pickDaily(list, n) {
    if (!Array.isArray(list) || list.length === 0) return [];
    const d = new Date();
    const seed = Number(`${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`);
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
      const r = (Math.sin(seed + i) + 1) * 10000;
      const j = Math.floor(r % (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr.slice(0, Math.min(n, arr.length));
  }

  const myInProgress = [];
  const myCompleted = [];

  return (
    <DashboardLayout>
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">🏆 Gardening Challenges</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete challenges, earn points, and compete on the leaderboard
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end gap-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white ${badge.color}`}>
              <span>{badge.emoji}</span>
              <span>{badge.name}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {completedCount} challenge{completedCount === 1 ? "" : "s"} completed · {totalPoints} pts
            </p>
          </div>
        </div>

        {!loading && daily.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl shadow-xl">
            <h2 className="text-lg font-semibold mb-2">📆 Daily picks</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Try these quick wins today and earn instant points.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {daily.map((challenge) => {
                const joined = isJoined(challenge.id);
                const uc = getUserChallenge(challenge.id);
                const isSample = String(challenge.id).startsWith("f");
                return (
                  <div key={challenge.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <p className="font-semibold text-sm">{challenge.title}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200">+{challenge.points ?? 0} XP</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{challenge.description}</p>
                    {joined ? (
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${uc?.progress || 0}%` }} />
                        </div>
                        <button
                          onClick={() => handleUpdateProgress(challenge.id, 100, "completed")}
                          className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 text-sm"
                        >
                          Mark Complete
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => !isSample && handleJoinChallenge(challenge.id)}
                        disabled={isSample}
                        className={`w-full py-2 rounded-xl text-sm ${isSample ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300" : "bg-green-600 text-white hover:bg-green-700"}`}
                      >
                        {isSample ? "Sample" : "Join"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Weekly spotlight + social share */}
        <div className="grid md:grid-cols-[2fr,1fr] gap-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl shadow-xl">
            <h2 className="text-lg font-semibold mb-2">📅 This week&apos;s challenges</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Pick 1–3 goals for this week, earn extra points, and keep your streak alive.
            </p>
            <div className="space-y-3">
              {weeklyChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800"
                >
                  <div>
                    <p className="font-semibold text-sm">{challenge.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {challenge.description}
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-semibold text-green-600">{challenge.points} pts</p>
                    <p className="text-gray-500">Difficulty: {challenge.difficulty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-3xl shadow-xl flex flex-col justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold mb-1">📣 Share your progress</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tell friends about your garden streak and invite them to compete.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await API.post("/challenges/share");
                    toast.success("+10 XP for sharing!");
                  } catch (_) {}
                  window.open(`https://wa.me/?text=${shareText}%20${appUrl}`, "_blank");
                }}
                className="px-3 py-1.5 rounded-full bg-green-500 text-white hover:bg-green-600"
              >
                Share on WhatsApp
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await API.post("/challenges/share");
                    toast.success("+10 XP for sharing!");
                  } catch (_) {}
                  window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${appUrl}`, "_blank");
                }}
                className="px-3 py-1.5 rounded-full bg-sky-500 text-white hover:bg-sky-600"
              >
                Share on X
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await API.post("/challenges/share");
                    toast.success("+10 XP for sharing!");
                  } catch (_) {}
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${appUrl}&quote=${shareText}`, "_blank");
                }}
                className="px-3 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Share on Facebook
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6">🏅 Leaderboard — Top Gardeners</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Rank by total XP. Compete and climb!</p>
            <div className="space-y-3">
              {topTen.map((u, index) => {
                const isTop3 = index < 3;
                const borderClass = index === 0 ? "border-amber-400 dark:border-amber-500" : index === 1 ? "border-gray-300 dark:border-gray-500" : index === 2 ? "border-amber-600 dark:border-amber-700" : "";
                return (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between p-4 rounded-xl ${isTop3 ? "bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 " + borderClass : "bg-gray-50 dark:bg-gray-800"}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold w-10 text-center">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </span>
                      <div>
                        <p className="font-semibold">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">🔥 {u.streak ?? 0} day streak</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">{u.points ?? u.xp ?? 0}</p>
                        <p className="text-xs text-gray-500">XP</p>
                      </div>
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

export default Challenges;
