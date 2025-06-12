import React, { useEffect, useState } from "react";
import { Box, Modal, IconButton, Grid, useMediaQuery, useTheme, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WeatherSummaryCard from "./WeatherSummaryCard";
import ForecastCards from "./ForecastCards";
import { LoadingSkeleton, ErrorCard, NoDataCard } from "./helperComponents";

const CACHE_TTL = 60 * 60 * 1000;
const baseUrl = process.env.REACT_APP_API_BASE_URL;

const CITIES = [
  { name: "Bangalore", lat: 12.956705079821537, lon: 77.70017294132057 },
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Delhi", lat: 28.7041, lon: 77.1025 },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { name: "Hyderabad", lat: 17.385, lon: 78.4867 },
  { name: "Pune", lat: 18.5204, lon: 73.8567 },
];

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [compareCity, setCompareCity] = useState(null);
  const [compareWeather, setCompareWeather] = useState(null);

  const fetchCompareWeather = async (lat, lon) => {
    try {
      const apiUrl = `${baseUrl}/api/weather/forecast-days?lat=${lat}&lon=${lon}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const apiData = await response.json();

      if (apiData.status === "success" && Array.isArray(apiData.data) && apiData.data.length > 0) {
        const firstDay = apiData.data[0];
        const weatherInfo = firstDay.weather[0];

        return {
          temperature: Math.round(firstDay.temp.day),
          description: weatherInfo.description || "No description",
          date: new Date(firstDay.dt * 1000).toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          icon: weatherInfo.icon || "01d",
        };
      }
    } catch (error) {
      console.error("Error fetching compare weather:", error);
      return null;
    }
  };

  const handleCompareCityChange = async (newCity) => {
    setCompareCity(newCity);
    const weatherData = await fetchCompareWeather(newCity.lat, newCity.lon);
    setCompareWeather(weatherData);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const fetchWeatherForCity = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);

      const cacheKey = `weather_forecast_${lat}_${lon}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          setWeather(data.current);
          setForecastData(data.forecast);
          setLoading(false);
          return;
        }
      }

      const apiUrl = `${baseUrl}/api/weather/forecast-days?lat=${lat}&lon=${lon}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const apiData = await response.json();

      if (apiData.status === "success" && Array.isArray(apiData.data) && apiData.data.length > 0) {
        const firstDay = apiData.data[0];
        const weatherInfo = firstDay.weather[0];

        const currentWeather = {
          city: selectedCity.name,
          temperature: Math.round(firstDay.temp.day),
          description: weatherInfo.description || "No description",
          date: new Date(firstDay.dt * 1000).toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          icon: weatherInfo.icon || "01d",
        };

        const forecast = apiData.data.map((day) => ({
          date: new Date(day.dt * 1000).toISOString(),
          dayTemp: Math.round(day.temp.day),
          nightTemp: Math.round(day.temp.night),
          minTemp: Math.round(day.temp.min),
          maxTemp: Math.round(day.temp.max),
          humidity: day.humidity,
          windSpeed: day.wind_speed,
          description: day.weather[0].description,
          icon: day.weather[0].icon,
        }));

        setWeather(currentWeather);
        setForecastData(forecast);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            timestamp: Date.now(),
            data: { current: currentWeather, forecast: forecast },
          })
        );
      } else {
        setError("No weather data available in the response");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (newCity) => {
    setSelectedCity(newCity);
    fetchWeatherForCity(newCity.lat, newCity.lon);
  };

  useEffect(() => {
    fetchWeatherForCity(selectedCity.lat, selectedCity.lon);
    // eslint-disable-next-line
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorCard error={error} />;
  if (!weather) return <NoDataCard />;

  return (
    <>
      <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        <Grid item xs={12} md={10} lg={8}>
          <WeatherSummaryCard
            temperature={weather.temperature}
            description={weather.description}
            date={weather.date}
            icon={weather.icon}
            onViewForecast={handleOpenModal}
            onCityChange={handleCityChange}
            selectedCity={selectedCity}
            cities={CITIES}
            onCompareCityChange={handleCompareCityChange}
            compareCity={compareCity}
            compareWeather={compareWeather}
          />
        </Grid>
      </Grid>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "95%" : "80%",
            maxWidth: 800,
            maxHeight: "80vh",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: isMobile ? 1 : 3,
            overflow: "hidden",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} p={1}>
            <Typography variant="h6" component="h2">
              Forecast for {selectedCity.name}
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          <ForecastCards forecastData={forecastData} />
        </Box>
      </Modal>
    </>
  );
}
