// WeatherApp.js
import React, { useEffect, useState } from "react";
import { Box, Modal, Grid, useMediaQuery, useTheme, Tabs, Tab } from "@mui/material";
import WeatherSummaryCard from "./WeatherSummaryCard";
import ForecastCards from "./ForecastCards";
import { LoadingSkeleton, ErrorCard, NoDataCard } from "./helperComponents";

const CACHE_TTL = 60 * 60 * 1000;
const baseUrl = process.env.REACT_APP_API_BASE_URL;

const CITIES = [
  { name: "Hampi", lat: 15.335, lon: 76.46 },
  { name: "Mysore Palace", lat: 12.3051, lon: 76.6551 },
  { name: "Badami Caves", lat: 15.9149, lon: 75.6768 },
  { name: "Coorg (Madikeri)", lat: 12.4244, lon: 75.7382 },
  { name: "Chikmagalur", lat: 13.3152, lon: 75.775 },
  { name: "Gokarna", lat: 14.5479, lon: 74.3188 },
  { name: "Bandipur National Park", lat: 11.6571, lon: 76.6295 },
];

// Helper to compare two dates without time
const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [compareForecastData, setCompareForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalTab, setModalTab] = useState(0);
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [compareCity, setCompareCity] = useState(null);
  const [compareWeather, setCompareWeather] = useState(null);

  const fetchWeather = async (lat, lon, cityName, cacheKeyPrefix, dateOverride = null) => {
    try {
      const dateParam = dateOverride ? dateOverride.toISOString().split("T")[0] : null;
      const cacheKey = `${cacheKeyPrefix}_${lat}_${lon}_${dateParam || "all"}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) return data;
      }

      const apiUrl = `${baseUrl}/api/weather/forecast-days?lat=${lat}&lon=${lon}${
        dateParam ? `&date=${dateParam}` : ""
      }`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const apiData = await response.json();
      if (!apiData.data || apiData.data.length === 0) throw new Error("No forecast data found");

      const firstDay = apiData.data[0];
      const weatherInfo = firstDay.weather[0];

      const currentWeather = {
        city: cityName,
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

      const data = { current: currentWeather, forecast };
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));

      return data;
    } catch (err) {
      throw new Error(err.message || "Weather fetch failed");
    }
  };

  const fetchWeatherForCity = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeather(
        selectedCity.lat,
        selectedCity.lon,
        selectedCity.name,
        "weather_forecast",
        isSameDay(selectedDate, new Date()) ? null : selectedDate
      );
      setWeather(data.current);
      setForecastData(data.forecast);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompareWeather = async (city) => {
    try {
      const data = await fetchWeather(
        city.lat,
        city.lon,
        city.name,
        "compare_forecast",
        isSameDay(selectedDate, new Date()) ? null : selectedDate
      );
      setCompareWeather(data.current);
      setCompareForecastData(data.forecast);
    } catch (err) {
      console.error("Compare weather error:", err);
      setCompareWeather(null);
      setCompareForecastData([]);
    }
  };

  useEffect(() => {
    fetchWeatherForCity();
  }, [selectedCity, selectedDate]);

  useEffect(() => {
    if (compareCity) fetchCompareWeather(compareCity);
  }, [compareCity, selectedDate]);

  const handleCityChange = (newCity) => setSelectedCity(newCity);
  const handleCompareCityChange = (newCity) => setCompareCity(newCity);
  const handleOpenModal = () => {
    setModalTab(0);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);
  const handleTabChange = (event, newValue) => setModalTab(newValue);
  const handleCompareViewForecast = () => {
    setModalTab(1);
    setOpenModal(true);
  };

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
            onCompareViewForecast={handleCompareViewForecast}
            onCityChange={handleCityChange}
            selectedCity={selectedCity}
            cities={CITIES}
            onCompareCityChange={handleCompareCityChange}
            compareCity={compareCity}
            compareWeather={compareWeather}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            lat={selectedCity.lat}
            lon={selectedCity.lon}
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
          <Tabs value={modalTab} onChange={handleTabChange} centered>
            <Tab label={selectedCity.name} />
            {compareCity && <Tab label={compareCity.name} />}
          </Tabs>

          <Box mt={2}>
            {modalTab === 0 && <ForecastCards forecastData={forecastData} />}
            {modalTab === 1 && compareCity && <ForecastCards forecastData={compareForecastData} />}
          </Box>
        </Box>
      </Modal>
    </>
  );
}
