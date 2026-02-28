import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const BADGES = [
  { min: 0, label: "🌱 Beginner", color: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200" },
  { min: 50, label: "🌿 Growing Gardener", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  { min: 150, label: "🌳 Expert Gardener", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
];

function getBadge(xp) {
  const n = Number(xp) || 0;
  for (let i = BADGES.length - 1; i >= 0; i--) {
    if (n >= BADGES[i].min) return BADGES[i];
  }
  return BADGES[0];
}

const Forum = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "general", tags: [] });
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiTags, setAiTags] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/forum");
      setPosts(res.data || []);
    } catch (err) {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchSearch = !searchQuery.trim() || [p.title, p.content].some((t) => String(t || "").toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const fetchPostDetails = async (id) => {
    try {
      const res = await API.get(`/forum/${id}`);
      setSelectedPost(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await API.post("/forum", {
        ...newPost,
        tags: aiTags.length ? aiTags : newPost.tags,
      });
      toast.success("Post created! +2 XP");
      setShowCreateModal(false);
      setNewPost({ title: "", content: "", category: "general", tags: [] });
      setAiSuggestion("");
      setAiTags([]);
      fetchPosts();
      refreshUser?.();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create post");
    }
  };

  const fetchAiSuggestion = async () => {
    const q = [newPost.title, newPost.content].filter(Boolean).join(" ");
    if (!q.trim()) {
      toast.error("Enter a title or question first");
      return;
    }
    setLoadingAi(true);
    try {
      const res = await API.post("/forum/ai/suggest-answer", { question: q });
      setAiSuggestion(res.data?.suggestion || "");
    } catch (_) {
      setAiSuggestion("AI suggestion unavailable.");
    } finally {
      setLoadingAi(false);
    }
  };

  const fetchAiTags = async () => {
    const text = [newPost.title, newPost.content].filter(Boolean).join(" ");
    if (!text.trim()) {
      toast.error("Enter some content first");
      return;
    }
    setLoadingAi(true);
    try {
      const res = await API.post("/forum/ai/suggest-tags", { content: text });
      setAiTags(res.data?.tags || []);
    } catch (_) {
      setAiTags([]);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await API.post(`/forum/${selectedPost.id}/comments`, { content: comment });
      toast.success("Comment added! +5 XP");
      setComment("");
      fetchPostDetails(selectedPost.id);
      refreshUser?.();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await API.post(`/forum/${postId}/like`);
      fetchPosts();
      if (selectedPost?.id === postId) fetchPostDetails(postId);
      refreshUser?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">👥 Community Forum</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share tips, ask questions, earn XP (+2 post, +5 answer, +3 upvote)
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition shrink-0"
          >
            + New Post
          </button>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchPosts()}
            className="flex-1 min-w-0 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:border-green-500 focus:outline-none"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="all">All categories</option>
            <option value="general">General</option>
            <option value="questions">Questions</option>
            <option value="tips">Tips</option>
            <option value="showcase">Showcase</option>
          </select>
          <button
            type="button"
            onClick={fetchPosts}
            className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700"
          >
            Search
          </button>
        </div>

        {/* Create Post Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <input
                  type="text"
                  placeholder="Post title / question"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700 focus:border-green-500 focus:outline-none"
                  required
                />
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="general">General</option>
                  <option value="questions">Questions</option>
                  <option value="tips">Tips</option>
                  <option value="showcase">Showcase</option>
                </select>
                <textarea
                  placeholder="What's on your mind? Ask a question or share a tip..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-32 focus:border-green-500 focus:outline-none"
                  required
                />
                {/* AI suggestion */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={fetchAiSuggestion}
                    disabled={loadingAi}
                    className="text-sm text-green-600 dark:text-green-400 hover:underline"
                  >
                    {loadingAi ? "..." : "💡 Get AI suggested answer"}
                  </button>
                  {aiSuggestion && (
                    <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">AI Suggestion:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{aiSuggestion}</p>
                    </div>
                  )}
                </div>
                {/* AI tags */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={fetchAiTags}
                    disabled={loadingAi}
                    className="text-sm text-green-600 dark:text-green-400 hover:underline"
                  >
                    {loadingAi ? "..." : "🏷️ Suggest tags"}
                  </button>
                  {aiTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {aiTags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700">
                    Post (+2 XP)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowCreateModal(false); setAiSuggestion(""); setAiTags([]); }}
                    className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Posts list */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-3xl text-center text-gray-500 dark:text-gray-400">
                  No posts yet. Create the first one!
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const badge = getBadge(post.user?.xp);
                  return (
                    <div
                      key={post.id}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all"
                      onClick={() => fetchPostDetails(post.id)}
                    >
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <h3 className="text-xl font-bold flex-1">{post.title}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 shrink-0 capitalize">
                          {post.category}
                        </span>
                      </div>
                      {Array.isArray(post.tags) && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.tags.map((tag, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{post.content}</p>
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            by {post.user?.name || "Anonymous"}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            💬 {post.comment_count ?? post.comments?.length ?? 0}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-500"
                          >
                            👍 {post.likes ?? 0}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Post detail sidebar */}
            {selectedPost && (
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-xl sticky top-4">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="mb-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    ← Back
                  </button>
                  <h2 className="text-2xl font-bold mb-4">{selectedPost.title}</h2>
                  {selectedPost.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {selectedPost.tags.map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-wrap">{selectedPost.content}</p>
                  <div className="space-y-4 mb-6">
                    <h3 className="font-semibold">Comments</h3>
                    {(selectedPost.comments || []).map((c) => (
                      <div key={c.id} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
                        <p className="text-sm font-semibold mb-1">{c.user?.name}</p>
                        <p className="text-sm">{c.content}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <textarea
                      placeholder="Add a comment... (+5 XP)"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700 focus:border-green-500 focus:outline-none"
                    />
                    <button
                      onClick={handleAddComment}
                      className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Forum;
