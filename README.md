# 🌱 Home Gardening Assistant - Frontend

A modern, responsive React application for managing your home garden with comprehensive features and beautiful UI.

## 📋 Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Video Walkthrough](#video-walkthrough)

## 🎯 Project Description

Home Gardening Assistant is a comprehensive web application designed to help gardening enthusiasts manage their gardens effectively. The application provides tools for plant care tracking, community engagement, educational resources, and personalized gardening assistance.

## ✨ Features

### Core Features
- ✅ **User Authentication** - Secure login and registration
- ✅ **Plant Database** - Comprehensive database with detailed care instructions
- ✅ **Garden Tracker** - Track your plants with photos, watering schedules, and care notes
- ✅ **Watering Reminders** - Never forget to water your plants
- ✅ **Pest & Disease Identification** - Identify and treat common plant problems
- ✅ **Community Forum** - Connect with other gardeners, share tips, ask questions
- ✅ **Seasonal Gardening Tips** - Get location-based seasonal advice
- ✅ **Plant Journal** - Document your gardening journey with photos and notes
- ✅ **Gardening Challenges** - Participate in challenges and earn points
- ✅ **Leaderboard** - Compete with other gardeners
- ✅ **AI-Based Suggestions** - Get personalized plant care recommendations
- ✅ **Shopping List** - Keep track of gardening supplies
- ✅ **Dark Mode** - Comfortable viewing in any lighting condition
- ✅ **Responsive Design** - Works perfectly on all devices

### Advanced Features
- 📊 **Dashboard Analytics** - Visual charts and statistics
- 🎨 **Modern UI/UX** - Beautiful, intuitive interface
- 🔔 **Toast Notifications** - Real-time feedback
- 📸 **Image Uploads** - Upload plant and journal photos
- 🔍 **Search Functionality** - Search plants, pests, and forum posts
- 📱 **Mobile Responsive** - Optimized for mobile devices

## 🛠 Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Charts**: Recharts
- **Animations**: React CountUp
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd homegardening-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API endpoint**
Update `src/services/api.js` with your backend URL:
```javascript
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Change to your backend URL
});
```

4. **Run the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📂 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── DashboardLayout.jsx    # Main layout with sidebar and navbar
│   └── ProtectedRoute.jsx          # Route protection component
├── context/
│   ├── AuthContext.jsx             # Authentication context
│   └── ThemeContext.jsx            # Dark mode context
├── pages/
│   ├── Landing.jsx                 # Landing page
│   ├── Login.jsx                   # Login page
│   ├── Register.jsx                # Registration page
│   ├── Dashboard.jsx               # Main dashboard
│   ├── Garden.jsx                  # Garden tracker page
│   ├── PlantDatabase.jsx           # Plant database page
│   ├── PestIdentification.jsx      # Pest identification page
│   ├── Forum.jsx                   # Community forum page
│   ├── Journal.jsx                 # Plant journal page
│   ├── Challenges.jsx              # Challenges page
│   ├── SeasonalTips.jsx            # Seasonal tips page
│   └── ShoppingList.jsx            # Shopping list page
├── services/
│   └── api.js                      # Axios API configuration
├── App.jsx                         # Main app component with routes
├── main.jsx                        # Application entry point
└── index.css                       # Global styles
```

## 🌐 Deployment

### Deploy to Netlify

1. **Build the project**
```bash
npm run build
```

2. **Deploy to Netlify**
   - Option A: Drag and drop the `dist` folder to Netlify
   - Option B: Connect GitHub repository and set build command: `npm run build`
   - Option C: Use Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod --dir=dist
     ```

3. **Configure Environment Variables** (if needed)
   - Add environment variables in Netlify dashboard
   - Update API base URL in `api.js` to use environment variable

4. **Update API Base URL**
   Make sure `src/services/api.js` points to your deployed backend:
   ```javascript
   const API = axios.create({
     baseURL: "https://your-backend.onrender.com/api",
   });
   ```

## 📸 Screenshots

### Landing Page
- Beautiful hero section with feature highlights
- Call-to-action buttons
- Responsive design

### Dashboard
- Statistics cards with animated counters
- Watering reminders
- Growth analytics chart
- AI suggestions panel
- Level progress tracker

### Garden Tracker
- Plant cards with images
- Watering status indicators
- Add plant modal with detailed fields
- Plant management actions

### Plant Database
- Searchable plant catalog
- Detailed plant information cards
- Filter by region

### Community Forum
- Post creation and viewing
- Comments and likes
- Category filtering
- Search functionality

## 🎥 Video Walkthrough

[Add your video demonstration link here]

## 🔗 Links

- **Deployed Application**: [Netlify Deployment Link]
- **Backend API**: [Render Deployment Link]
- **Backend Repository**: [Backend GitHub Link]

## 🔐 Login Credentials

For testing purposes:
- **Email**: test@example.com
- **Password**: password123

*Note: Create your own account through the registration page*

## 🎨 Design Features

- **Modern UI**: Clean, intuitive interface with smooth animations
- **Dark Mode**: Toggle between light and dark themes
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: Proper contrast ratios and semantic HTML
- **Performance**: Optimized loading and smooth transitions

## 🚧 Future Enhancements

- [ ] Garden layout planner with drag-and-drop
- [ ] Social media sharing integration
- [ ] Push notifications for watering reminders
- [ ] Advanced AI plant disease detection from images
- [ ] Weather integration for better care suggestions
- [ ] Export garden data to PDF
- [ ] Multi-language support

## 📝 Notes

- Make sure your backend is running before using the frontend
- Update the API base URL in `src/services/api.js` for production
- All images are stored using external storage (e.g. AWS S3)
- JWT tokens are stored in localStorage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC

## 👨‍💻 Author

Home Gardening Assistant Team

---

**Built with ❤️ for gardening enthusiasts**
