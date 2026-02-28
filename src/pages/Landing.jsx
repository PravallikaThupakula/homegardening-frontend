import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Landing = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode ? "bg-gradient-to-br from-gray-900 via-green-900 to-black" : "bg-gradient-to-br from-green-50 via-white to-emerald-50"
    }`}>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            🌱 Home Gardening Assistant
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300">
            Your Complete Guide to Beautiful Gardens
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border-2 border-green-600 dark:border-green-400"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className={`p-8 rounded-3xl shadow-xl transition-all hover:scale-105 ${
            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
          }`}>
            <div className="text-5xl mb-4">🌿</div>
            <h3 className="text-2xl font-bold mb-3">My Garden</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track your plants with detailed care instructions and watering reminders
            </p>
          </div>

          <div className={`p-8 rounded-3xl shadow-xl transition-all hover:scale-105 ${
            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
          }`}>
            <div className="text-5xl mb-4">💧</div>
            <h3 className="text-2xl font-bold mb-3">Watering Reminders</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Never forget to water your plants with smart reminders
            </p>
          </div>

          <div className={`p-8 rounded-3xl shadow-xl transition-all hover:scale-105 ${
            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
          }`}>
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold mb-3">AI Suggestions</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get personalized care tips powered by AI
            </p>
          </div>

          <div className={`p-8 rounded-3xl shadow-xl transition-all hover:scale-105 ${
            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
          }`}>
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-2xl font-bold mb-3">Community Forum</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with fellow gardeners and share tips
            </p>
          </div>

          <div className={`p-8 rounded-3xl shadow-xl transition-all hover:scale-105 ${
            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
          }`}>
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold mb-3">Challenges</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Participate in gardening challenges and earn points
            </p>
          </div>

          <div className={`p-8 rounded-3xl shadow-xl transition-all hover:scale-105 ${
            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
          }`}>
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-3">Plant Journal</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Document your gardening journey with photos and notes
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center p-12 rounded-3xl shadow-2xl ${
          darkMode ? "bg-gradient-to-r from-green-800 to-emerald-800" : "bg-gradient-to-r from-green-500 to-emerald-500"
        }`}>
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Gardening Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of gardeners growing beautiful plants
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
