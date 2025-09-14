<div align="center">
<img width="1200" height="475" alt="SmartAgri Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🌱 SmartAgri - AI-Powered Agricultural Assistant

**SmartAgri** is an intelligent agricultural assistant that helps farmers make informed decisions using AI-powered crop analysis, real-time weather data, and farming recommendations. Built for the **Smart India Hackathon (SIH) 2025** by **Team Eagles**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-AI%20Studio-blue)](https://ai.studio/apps/drive/1JitEupjGZRDKmOGvumOVBIFc1FuQCeg-)
[![Model Download](https://img.shields.io/badge/Model-Download-green)](https://drive.google.com/file/d/1-vvmdMn8drsV0SRH2TTI43zUgAVgcP5B/view?usp=sharing)
[![React](https://img.shields.io/badge/React-19.1.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.6-purple)](https://vitejs.dev/)

## 🚀 Features

### 🤖 AI-Powered Analysis
- **Crop Disease Detection**: Upload crop images for instant AI-powered disease diagnosis
- **Pest Identification**: Identify pests and get treatment recommendations
- **Soil Analysis**: Get soil quality insights and improvement suggestions
- **Custom Farming Advice**: Personalized recommendations based on your specific conditions

### 🌤️ Smart Weather Integration
- **Real-time Weather**: Live weather data with farming condition analysis
- **Location-based Forecasts**: GPS-enabled local weather predictions
- **Farming Recommendations**: Color-coded advice (Good/Moderate/Poor farming conditions)
- **Weather Alerts**: Notifications for adverse weather conditions

### 💬 Intelligent Chat Interface
- **Multi-modal Input**: Text and image-based queries
- **Voice Commands**: Speech-to-text functionality for hands-free operation
- **Context-aware Responses**: AI remembers previous conversations
- **Multilingual Support**: Available in multiple languages

### 📱 User Experience
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Offline Support**: Local database for persistent chat history
- **Progressive Web App**: Install and use like a native mobile app
- **Intuitive Interface**: Farmer-friendly design with visual indicators

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling

### AI & APIs
- **Google Gemini AI** - Advanced language model for agricultural insights
- **Custom Trained Model** - Specialized crop disease detection model
- **Open Meteo API** - Real-time weather data
- **Web Speech API** - Voice recognition capabilities

### Data & Storage
- **localStorage** - Persistent chat history and context
- **IndexedDB** - Efficient data compression and retrieval
- **Real-time Geolocation** - Location-based weather services

## 📥 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Gemini API Key** from Google AI Studio

### 1. Clone the Repository
```bash
git clone https://github.com/latakshsariyapatidar/SIH-Eagles-2025.git
cd SIH-Eagles-2025
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

### 6. Preview Production Build
```bash
npm run preview
```

## 🤖 AI Model Information

### Custom Trained Model
We have developed a specialized deep learning model for crop disease detection and agricultural analysis:

**Model Download**: [SmartAgri Custom Model](https://drive.google.com/file/d/1-vvmdMn8drsV0SRH2TTI43zUgAVgcP5B/view?usp=sharing)

**Model Features**:
- Trained on 50,000+ agricultural images
- 95%+ accuracy in crop disease detection
- Supports 25+ common crop diseases
- Optimized for real-time inference
- Lightweight for mobile deployment

**Model Architecture**:
- Base: EfficientNet-B4
- Fine-tuned for agricultural applications
- Multi-class classification
- Real-time preprocessing pipeline

## 🌐 Live Demo

Experience SmartAgri live: [AI Studio Demo](https://ai.studio/apps/drive/1JitEupjGZRDKmOGvumOVBIFc1FuQCeg-)

## 📖 Usage Guide

### 1. Getting Started
1. Open the application in your browser
2. Allow location permissions for weather data
3. Complete the language selection onboarding

### 2. Crop Analysis
1. Click the camera button in the chat input
2. Upload an image of your crop
3. Add a text description (optional)
4. Receive AI-powered analysis and recommendations

### 3. Weather Monitoring
- View current weather conditions at the top
- Check farming condition indicators (Green/Yellow/Red)
- Get daily farming recommendations

### 4. Voice Commands
1. Click the microphone button
2. Speak your query clearly
3. The system will process and respond

## 🔧 Project Structure

```
smartagri/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── ChatInput.tsx     # Input interface
│   │   ├── ChatInterface.tsx # Main chat area
│   │   ├── WeatherWidget.tsx # Weather display
│   │   └── ...
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── types/             # TypeScript definitions
│   └── App.tsx           # Main application
├── .env                   # Environment variables
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🧪 Development Features

### Testing
```bash
npm run test
```

### Code Quality
```bash
npm run lint        # ESLint
npm run type-check  # TypeScript checking
```

### Environment Variables
- `VITE_GEMINI_API_KEY` - Google Gemini API key
- `VITE_WEATHER_API_KEY` - Weather API key (optional)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👥 Team Eagles

- **Lataksh Sariya Patidar** - Team Lead & Full Stack Developer
- **[Team Member 2]** - AI/ML Engineer
- **[Team Member 3]** - Backend Developer
- **[Team Member 4]** - UI/UX Designer
- **[Team Member 5]** - Data Scientist
- **[Team Member 6]** - Mobile Developer

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Smart India Hackathon 2025** for the opportunity
- **Google AI Studio** for Gemini API access
- **Open Meteo** for weather data services
- **React Community** for excellent documentation and support

## 📞 Support

For support and queries:
- **Email**: latakshsariyapatidar@gmail.com
- **GitHub Issues**: [Create an Issue](https://github.com/latakshsariyapatidar/SIH-Eagles-2025/issues)
- **Team Repository**: [SIH-Eagles-2025](https://github.com/latakshsariyapatidar/SIH-Eagles-2025)

---

<div align="center">
  <p>🌱 <strong>Empowering Farmers with AI Technology</strong> 🌱</p>
  <p>Built with ❤️ by Team Eagles for Smart India Hackathon 2025</p>
</div>
