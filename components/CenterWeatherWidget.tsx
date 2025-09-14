import React, { useState, useEffect } from 'react';

const SunIcon = ({ size = 48 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path><path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path><path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
);

const RainIcon = ({ size = 32 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
        <path d="m16 14-3 5-3-5"></path>
        <path d="m8 14-3 5-3-5"></path>
    </svg>
);

const ThermometerIcon = ({ size = 32 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
        <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path>
    </svg>
);

const LoadingIcon = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin text-blue-400">
        <path d="M21 12a9 9 0 11-6.219-8.56"></path>
    </svg>
);

const CheckIcon = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
        <path d="M20 6 9 17l-5-5"></path>
    </svg>
);

const AlertIcon = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
        <path d="m21 16-4 4-4-4"></path>
        <path d="M3 12h14"></path>
        <path d="M3 6h14"></path>
        <path d="M3 18h14"></path>
    </svg>
);

const WarningIcon = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
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

const CenterWeatherWidget = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Analyze farming conditions based on weather
    const analyzeFarmingConditions = () => {
        if (!weatherData) return null;
        
        const temp = weatherData.current.temperature_2m;
        const windSpeed = weatherData.current.wind_speed_10m;
        const currentHour = new Date().getHours();
        const precipitation = weatherData.hourly.precipitation?.[currentHour] || 0;
        
        let condition = 'good';
        let message = 'Perfect for farming today!';
        let bgColor = 'bg-green-100';
        let textColor = 'text-green-800';
        let borderColor = 'border-green-300';
        let icon = <CheckIcon size={20} />;

        // Temperature analysis (ideal range: 15-30°C)
        if (temp < 5 || temp > 40) {
            condition = 'poor';
            message = 'Extreme temperature - not ideal for farming';
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            borderColor = 'border-red-300';
            icon = <WarningIcon size={20} />;
        } else if (temp < 10 || temp > 35) {
            condition = 'moderate';
            message = 'Moderate conditions - some crops may be affected';
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            borderColor = 'border-yellow-300';
            icon = <AlertIcon size={20} />;
        }

        // Precipitation analysis
        if (precipitation > 20) {
            condition = 'poor';
            message = 'Heavy rain expected - avoid outdoor farming';
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            borderColor = 'border-red-300';
            icon = <WarningIcon size={20} />;
        } else if (precipitation > 10) {
            condition = 'moderate';
            message = 'Light rain expected - plan accordingly';
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            borderColor = 'border-yellow-300';
            icon = <AlertIcon size={20} />;
        }

        // Wind speed analysis (ideal: < 15 km/h)
        if (windSpeed > 25) {
            condition = 'poor';
            message = 'High winds - not suitable for spraying';
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            borderColor = 'border-red-300';
            icon = <WarningIcon size={20} />;
        }

        return { condition, message, bgColor, textColor, borderColor, icon };
    };

    // Request location permission and get coordinates
    const requestLocation = async () => {
        setLoading(true);
        setError(null);

        try {
            if (!navigator.geolocation) {
                throw new Error('Geolocation is not supported by this browser');
            }

            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 300000
                    }
                );
            });

            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            
            await fetchWeatherData(latitude, longitude);
        } catch (err: any) {
            console.error('Location error:', err);
            
            if (err.code === 1) {
                setError('Location access denied');
            } else if (err.code === 2) {
                setError('Location unavailable');
            } else if (err.code === 3) {
                setError('Location request timed out');
            } else {
                setError('Using default location');
                // Fallback to default location
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
            setError('Failed to fetch weather data');
        }
    };

    // Get weather description based on temperature
    const getWeatherDescription = (temp: number): string => {
        if (temp > 30) return 'Hot';
        if (temp > 25) return 'Warm';
        if (temp > 15) return 'Mild';
        if (temp > 5) return 'Cool';
        return 'Cold';
    };

    // Auto-fetch location on component mount
    useEffect(() => {
        requestLocation();
    }, []);

    return (
        <div className="flex-1 flex items-center justify-center px-6 py-8">
            <div className="text-center space-y-6 max-w-sm w-full">
                {/* Weather Icon */}
                <div className="flex justify-center mb-4">
                    <SunIcon size={64} />
                </div>

                {/* Main Title */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Today's Weather</h2>
                    <p className="text-gray-600 text-sm">Current conditions for your location</p>
                </div>

                {/* Weather Data */}
                {loading ? (
                    <div className="flex flex-col items-center space-y-2">
                        <LoadingIcon size={32} />
                        <p className="text-gray-600">Getting weather data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center space-y-2">
                        <p className="text-red-600 text-sm">{error}</p>
                        <button
                            onClick={requestLocation}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : weatherData ? (
                    <div className="space-y-4">
                        {/* Temperature and Rain */}
                        <div className="flex justify-center space-x-8">
                            <div className="text-center">
                                <ThermometerIcon size={40} />
                                <p className="text-2xl font-bold text-gray-800 mt-2">
                                    {Math.round(weatherData.current.temperature_2m)}°C
                                </p>
                                <p className="text-sm text-gray-600">
                                    {getWeatherDescription(weatherData.current.temperature_2m)}
                                </p>
                            </div>
                            <div className="text-center">
                                <RainIcon size={40} />
                                <p className="text-2xl font-bold text-gray-800 mt-2">
                                    {Math.round(weatherData.hourly.precipitation?.[new Date().getHours()] || 0)}mm
                                </p>
                                <p className="text-sm text-gray-600">Rain Today</p>
                            </div>
                        </div>

                        {/* Farming Conditions */}
                        {(() => {
                            const conditions = analyzeFarmingConditions();
                            if (!conditions) return null;
                            return (
                                <div className={`p-4 rounded-xl border-2 ${conditions.bgColor} ${conditions.textColor} ${conditions.borderColor}`}>
                                    <div className="flex items-center justify-center space-x-2 mb-2">
                                        {conditions.icon}
                                        <span className="font-semibold">Farming Conditions</span>
                                    </div>
                                    <p className="text-sm text-center">{conditions.message}</p>
                                </div>
                            );
                        })()}

                        {/* Additional Weather Info */}
                        <div className="bg-gray-100 rounded-lg p-3 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Wind Speed:</span>
                                <span className="font-medium">{Math.round(weatherData.current.wind_speed_10m)} km/h</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Humidity:</span>
                                <span className="font-medium">{Math.round(weatherData.hourly.relative_humidity_2m[new Date().getHours()] || 50)}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Last Updated:</span>
                                <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* Instruction */}
                <div className="text-center pt-4">
                    <p className="text-gray-500 text-sm">
                        Send your first message to start chatting with SmartAgri AI
                    </p>
                    <div className="flex justify-center mt-2">
                        <div className="animate-bounce">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CenterWeatherWidget;