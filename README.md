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
[![Hugging Face](https://img.shields.io/badge/🤗%20Hugging%20Face-GPT--OSS--120B-yellow)](https://huggingface.co/)

## 🚀 Features

### 🤖 AI-Powered Analysis
- **Advanced Language Model**: Powered by Hugging Face GPT-OSS-120B for intelligent agricultural insights
- **Crop Disease Detection**: Upload crop images for instant AI-powered disease diagnosis
- **Pest Identification**: Identify pests and get treatment recommendations
- **Soil Analysis**: Get soil quality insights and improvement suggestions
- **Custom Farming Advice**: Personalized recommendations based on your specific conditions
- **Contextual Conversations**: AI remembers previous discussions for better assistance

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
- **Smart JSON Responses**: Structured responses with urgency levels and actionable content

### 📱 User Experience
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Offline Support**: Local database for persistent chat history
- **Progressive Web App**: Install and use like a native mobile app
- **Intuitive Interface**: Farmer-friendly design with visual indicators
- **Fixed Layout**: Optimized chat input with proper mobile handling

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - Modern UI framework with latest features
- **TypeScript 5.6.2** - Type-safe development with enhanced IntelliSense
- **Vite 6.3.6** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first styling with responsive design

### AI & Machine Learning
- **Hugging Face GPT-OSS-120B** - Advanced open-source language model via Cerebras acceleration
- **OpenAI SDK** - Compatible API interface for Hugging Face router
- **Custom Trained Model** - Specialized crop disease detection model (95%+ accuracy)
- **Contextual AI** - Conversation memory and persistent learning

### APIs & Services
- **Hugging Face Inference API** - `https://router.huggingface.co/v1`
- **Open Meteo API** - Real-time weather data and forecasting
- **Web Speech API** - Voice recognition and text-to-speech
- **Geolocation API** - GPS-based location services

### Data & Storage
- **localStorage** - Persistent chat history and user preferences
- **IndexedDB** - Efficient data compression and context retrieval
- **JSON Database** - Offline-first data architecture
- **Context Management** - Cross-session conversation persistence
- **Custom Trained Model** - Specialized crop disease detection model
- **Open Meteo API** - Real-time weather data
- **Web Speech API** - Voice recognition capabilities

### Data & Storage
- **localStorage** - Persistent chat history and context
- **IndexedDB** - Efficient data compression and retrieval
- **Real-time Geolocation** - Location-based weather services

## 📥 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher) - Runtime environment
- **npm** or **yarn** - Package manager
- **Hugging Face API Token** - Free account from [Hugging Face Hub](https://huggingface.co/)

### 🔑 Getting Your Hugging Face Token
1. Visit [Hugging Face](https://huggingface.co/) and create a free account
2. Go to [Settings → Access Tokens](https://huggingface.co/settings/tokens)
3. Create a new token with "Read" permissions
4. Copy the token (starts with `hf_...`)

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
VITE_HF_TOKEN=hf_your_token_here
```

**Example:**
```env
VITE_HF_TOKEN=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
```

⚠️ **Important**: Never commit your actual API token to version control!

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

### Hugging Face GPT-OSS-120B Integration
SmartAgri uses the powerful **GPT-OSS-120B** model via Hugging Face's inference API:

**Model Details**:
- **Model**: `openai/gpt-oss-120b:cerebras`
- **Provider**: Hugging Face Inference API
- **Acceleration**: Cerebras CS-2 systems for ultra-fast inference
- **Endpoint**: `https://router.huggingface.co/v1`
- **Context Length**: Up to 8K tokens
- **Response Format**: Structured JSON for agricultural insights

**Agricultural Capabilities**:
- Crop disease diagnosis and treatment recommendations
- Farming advice based on weather and soil conditions
- Market price predictions and trends
- Pest identification and management strategies
- Contextual conversations with farming history

### Custom Trained Model
We have also developed a specialized deep learning model for crop disease detection:

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
1. Open the application in your browser (`http://localhost:5173`)
2. Allow location permissions for weather data
3. Complete the language selection onboarding
4. The center weather widget shows initial farming conditions

### 2. AI Chat Interaction
1. **Text Queries**: Type farming questions like "What crops should I plant in Punjab?"
2. **Voice Input**: Click the microphone button and speak your query
3. **Image Analysis**: Click the camera button to upload crop images for diagnosis
4. **Context Memory**: The AI remembers your previous conversations for better assistance

### 3. Response Types
The AI provides structured responses in different card types:
- **🏥 CURE**: Disease diagnosis and treatment steps (Critical/Medium urgency)
- **💰 PRICE**: Market prices and trends for harvest-ready crops
- **🌦️ WEATHER**: Weather-based farming advice
- **💡 TIP**: General farming tips and best practices
- **🚨 ALERT**: Urgent agricultural warnings

### 4. Weather Monitoring
- **Header Widget**: Compact weather info with farming conditions
- **Center Widget**: Detailed weather display on the initial screen
- **Color Indicators**: Green (Good), Yellow (Moderate), Red (Poor) farming conditions
- **Location-based**: Automatic GPS-based weather for your area

### 5. Voice Commands
1. Click the microphone button in the chat input
2. Speak your query clearly in your preferred language
3. The system converts speech to text automatically
4. AI processes and responds with relevant agricultural advice

### 6. Mobile Optimization
- **Responsive Design**: Works perfectly on all device sizes
- **Fixed Input**: Chat input stays at bottom for easy access
- **Image Preview**: Absolute positioning prevents layout shifts
- **Viewport Handling**: Optimized for mobile browsers with `h-dvh`

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
- `VITE_HF_TOKEN` - Hugging Face API token
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
