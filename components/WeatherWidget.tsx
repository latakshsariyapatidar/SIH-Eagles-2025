
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path><path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path><path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const LoadingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin text-blue-400">
        <path d="M21 12a9 9 0 11-6.219-8.56"></path>
    </svg>
);

const WindIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
        <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"></path>
        <path d="M9.6 4.6A2 2 0 1 1 11 8H2"></path>
        <path d="M12.6 19.4A2 2 0 1 0 14 16H2"></path>
    </svg>
);

const RainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
        <path d="m16 14-3 5-3-5"></path>
        <path d="m8 14-3 5-3-5"></path>
    </svg>
);

const ThermometerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
        <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path>
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
        <path d="M20 6 9 17l-5-5"></path>
    </svg>
);

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
        <path d="m21 16-4 4-4-4"></path>
        <path d="M3 12h14"></path>
        <path d="M3 6h14"></path>
        <path d="M3 18h14"></path>
    </svg>
);

const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
        <path d="M12 9v4"></path>
        <path d="m12 17 .01 0"></path>
    </svg>
);

interface WeatherData {
    current: {
        temperature_2m: number;
        wind_speed_10m: number;
        precipitation?: number;
        time: string;
    };
    hourly: {
        temperature_2m: number[];
        relative_humidity_2m: number[];
        wind_speed_10m: number[];
        precipitation?: number[];
        time: string[];
    };
}

interface LocationData {
    latitude: number;
    longitude: number;
    city?: string;
}

const WeatherWidget = () => {
    const { getText } = useAppContext();
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');

    // Request location permission and get coordinates
    const requestLocation = async () => {
        setLoading(true);
        setError(null);

        try {
            // Check if geolocation is supported
            if (!navigator.geolocation) {
                throw new Error('Geolocation is not supported by this browser');
            }

            // Request location permission
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 300000 // 5 minutes cache
                    }
                );
            });

            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            setPermissionStatus('granted');
            
            // Fetch weather data
            await fetchWeatherData(latitude, longitude);
        } catch (err: any) {
            console.error('Location error:', err);
            setPermissionStatus('denied');
            
            if (err.code === 1) {
                setError('Location access denied. Please enable location permissions and try again.');
            } else if (err.code === 2) {
                setError('Location unavailable. Please check your GPS settings.');
            } else if (err.code === 3) {
                setError('Location request timed out. Please try again.');
            } else {
                setError('Failed to get location. Using default location.');
                // Fallback to default location (example: New Delhi, India)
                await fetchWeatherData(28.6139, 77.2090);
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch weather data from Open Meteo API
    const fetchWeatherData = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,precipitation&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&timezone=auto&forecast_days=1`
            );

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data: WeatherData = await response.json();
            setWeatherData(data);
            setError(null);
        } catch (err: any) {
            console.error('Weather API error:', err);
            setError('Failed to fetch weather data. Please try again later.');
        }
    };

    // Auto-fetch location on component mount
    useEffect(() => {
        requestLocation();
    }, []);

    // Get weather condition emoji based on temperature and humidity
    const getWeatherEmoji = () => {
        if (!weatherData) return '🌤️';
        
        const temp = weatherData.current.temperature_2m;
        const currentHour = new Date().getHours();
        const humidity = weatherData.hourly.relative_humidity_2m[currentHour] || 50;
        
        if (temp > 30) return '☀️';
        if (temp < 10) return '❄️';
        if (humidity > 80) return '🌧️';
        if (humidity > 60) return '☁️';
        return '🌤️';
    };

    // Get farming advice based on weather
    const getFarmingAdvice = () => {
        if (!weatherData) return 'Loading weather data...';

        const temp = weatherData.current.temperature_2m;
        const windSpeed = weatherData.current.wind_speed_10m;
        const currentHour = new Date().getHours();
        const humidity = weatherData.hourly.relative_humidity_2m[currentHour] || 50;

        if (temp > 35) return 'Very hot - avoid midday farming, ensure proper hydration';
        if (temp < 5) return 'Very cold - protect crops from frost';
        if (windSpeed > 20) return 'Windy conditions - avoid spraying pesticides';
        if (humidity > 85) return 'High humidity - watch for fungal diseases';
        if (temp >= 20 && temp <= 30 && windSpeed < 15) return 'Perfect conditions for farming activities';
        return 'Good weather for outdoor farming';
    };

    // Analyze farming conditions based on weather
    const analyzeFarmingConditions = () => {
        if (!weatherData) return null;
        
        const temp = weatherData.current.temperature_2m;
        const windSpeed = weatherData.current.wind_speed_10m;
        const currentHour = new Date().getHours();
        const precipitation = weatherData.hourly.precipitation?.[currentHour] || 0;
        
        let condition = 'good';
        let message = 'Good for farming';
        let bgColor = 'bg-green-100';
        let textColor = 'text-green-800';
        let borderColor = 'border-green-300';
        let icon = <CheckIcon />;

        // Temperature analysis (ideal range: 15-30°C)
        if (temp < 5 || temp > 40) {
            condition = 'poor';
            message = 'Extreme temperature - not ideal for farming';
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            borderColor = 'border-red-300';
            icon = <WarningIcon />;
        } else if (temp < 10 || temp > 35) {
            condition = 'moderate';
            message = 'Moderate conditions - some crops may be affected';
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            borderColor = 'border-yellow-300';
            icon = <AlertIcon />;
        }

        // Precipitation analysis
        if (precipitation > 20) {
            condition = 'poor';
            message = 'Heavy rain expected - avoid outdoor farming activities';
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            borderColor = 'border-red-300';
            icon = <WarningIcon />;
        } else if (precipitation > 10) {
            condition = 'moderate';
            message = 'Light rain expected - plan accordingly';
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            borderColor = 'border-yellow-300';
            icon = <AlertIcon />;
        }

        // Wind speed analysis (ideal: < 15 km/h)
        if (windSpeed > 25) {
            condition = 'poor';
            message = 'High winds - not suitable for spraying or delicate operations';
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            borderColor = 'border-red-300';
            icon = <WarningIcon />;
        }

        return { condition, message, bgColor, textColor, borderColor, icon };
    };    return (
        <div className="bg-zinc-300 text-black px-4 py-3 text-sm sticky top-0 z-10 backdrop-blur-md border-b border-white/20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <SunIcon />
                        <span className="font-semibold text-base">{getText('weatherTitle')}</span>
                        {loading && <LoadingIcon />}
                    </div>
                    
                    {/* Location status */}
                    {/* {location && (
                        <div className="flex items-center gap-1 text-xs bg-blue-100 px-2 py-1 rounded-full">
                            <LocationIcon />
                            <span>Live Location</span>
                        </div>
                    )} */}
                </div>
                
                {/* Weather data or error/loading state */}
                {error ? (
                    <div className="flex items-center gap-2">
                        <span className="text-red-600 text-xs">{error}</span>
                        <button
                            onClick={requestLocation}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : weatherData ? (
                    <div className="flex items-center gap-3 text-sm">
                        {/* Temperature */}
                        <div className="flex items-center gap-1">
                            <ThermometerIcon />
                            <span className="font-bold">{Math.round(weatherData.current.temperature_2m)}°C</span>
                        </div>
                        
                        {/* Rain forecast */}
                        <div className="flex items-center gap-1">
                            <RainIcon />
                            <span className="font-bold">{Math.round(weatherData.hourly.precipitation?.[new Date().getHours()] || 0)}mm</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-sm">
                        <LoadingIcon />
                        <span>Getting your location...</span>
                    </div>
                )}
            </div>
            
            {/* Farming conditions indicator */}
            {weatherData && (
                <div className="mt-3">
                    {(() => {
                        const conditions = analyzeFarmingConditions();
                        if (!conditions) return null;
                        return (
                            <div className={`flex items-center gap-2 p-2 rounded-lg border ${conditions.bgColor} ${conditions.textColor} ${conditions.borderColor}`}>
                                {conditions.icon}
                                <span className="font-medium text-xs">{conditions.message}</span>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* Weather forecast and farming advice */}
            <div className="mt-2 flex items-center gap-2 text-xs opacity-90">
                <span>{getWeatherEmoji()}</span>
                <span>Wind: {weatherData ? Math.round(weatherData.current.wind_speed_10m) : 0} km/h</span>
                <span>•</span>
                <span>Humidity: {weatherData ? Math.round(weatherData.hourly.relative_humidity_2m[new Date().getHours()] || 50) : 50}%</span>
                {weatherData && (
                    <>
                        <span>•</span>
                        <span>Updated: {new Date().toLocaleTimeString()}</span>
                    </>
                )}
            </div>
        </div>
    );
};

export default WeatherWidget;
