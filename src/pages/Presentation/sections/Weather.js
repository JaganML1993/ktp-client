import React, { useEffect, useState } from "react";
import { Box, Modal, Grid, useMediaQuery, useTheme, Tabs, Tab } from "@mui/material";
import WeatherSummaryCard from "./WeatherSummaryCard";
import ForecastCards from "./ForecastCards";
import { LoadingSkeleton, ErrorCard, NoDataCard } from "./helperComponents";

const CACHE_TTL = 60 * 60 * 1000;
const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function WeatherApp() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [compareCity, setCompareCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [compareWeather, setCompareWeather] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [compareForecastData, setCompareForecastData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalTab, setModalTab] = useState(0);
  const [locationDetails, setLocationDetails] = useState(null);
  const [compareLocationDetails, setCompareLocationDetails] = useState(null);
  const [showCompare, setShowCompare] = useState(false);
  const [hourlyData, setHourlyData] = useState([]);
  const [compareHourlyData, setCompareHourlyData] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/admin/all-locations`);
        const result = await res.json();
        if (result.status === "success") {
          const formatted = result.data.map((loc) => ({ id: loc._id, name: loc.locationName }));
          setCities(formatted);
          setSelectedCity(formatted[0]);
        }
      } catch (err) {
        setError("Failed to load cities");
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      const fetchLocationDetails = async (id) => {
        try {
          const res = await fetch(`${baseUrl}/api/admin/location-details/${id}`);
          const result = await res.json();
          if (result.status === "success") {
            setLocationDetails(result.data);
          }
        } catch (err) {
          console.error("Failed to load location details", err);
        }
      };
      fetchLocationDetails(selectedCity.id);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (compareCity) {
      const fetchCompareLocationDetails = async (id) => {
        try {
          const res = await fetch(`${baseUrl}/api/admin/location-details/${id}`);
          const result = await res.json();
          if (result.status === "success") {
            setCompareLocationDetails(result.data);
          }
        } catch (err) {
          console.error("Failed to load compare location details", err);
        }
      };
      fetchCompareLocationDetails(compareCity.id);
    } else {
      setCompareLocationDetails(null);
    }
  }, [compareCity]);

  const fetchWeather = async (cityId, cityName, cacheKeyPrefix, dateOverride = null) => {
    try {
      const dateParam = dateOverride ? dateOverride.toISOString().split("T")[0] : null;
      const cacheKey = `${cacheKeyPrefix}_${cityId}_${dateParam || "all"}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) return data;
      }

      const apiUrl = `${baseUrl}/api/weather/forecast-days?cityId=${cityId}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const apiData = await response.json();
      if (!apiData.data || apiData.data.length === 0) throw new Error("No forecast data found");

      // Find data for the selected date
      let selectedDayData;
      if (dateOverride) {
        const selectedDateStr = dateOverride.toISOString().split("T")[0];
        selectedDayData = apiData.data.find((day) => {
          const dayDate = new Date(day.dt * 1000).toISOString().split("T")[0];
          return dayDate === selectedDateStr;
        });

        if (!selectedDayData) {
          throw new Error("No data available for selected date");
        }
      } else {
        // Default to today's data if no date override
        selectedDayData = apiData.data[0];
      }

      const weatherInfo = selectedDayData.weather[0];

      // Filter hourly data for the selected date only
      const selectedDateStart = dateOverride ? new Date(dateOverride) : new Date();
      selectedDateStart.setHours(0, 0, 0, 0);

      const selectedDateEnd = dateOverride ? new Date(dateOverride) : new Date();
      selectedDateEnd.setHours(23, 59, 59, 999);

      const filteredHourly =
        apiData.hourly
          ?.filter((hour) => {
            const hourDate = new Date(hour.dt * 1000);
            return hourDate >= selectedDateStart && hourDate <= selectedDateEnd;
          })
          .map((hour) => ({
            time: new Date(hour.dt * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            temp: Math.round(hour.temp),
            feels_like: Math.round(hour.feels_like),
            humidity: hour.humidity,
            wind_speed: hour.wind_speed,
            description: hour.weather[0].description,
            icon: hour.weather[0].icon,
            pop: Math.round(hour.pop * 100),
          })) || [];

      const currentWeather = {
        city: cityName,
        temperature: Math.round(selectedDayData.temp.day),
        description: weatherInfo.description || "No description",
        date: new Date(selectedDayData.dt * 1000).toLocaleDateString("en-IN", {
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

      const data = {
        current: currentWeather,
        forecast,
        hourly: filteredHourly,
      };

      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
      return data;
    } catch (err) {
      throw new Error(err.message || "Weather fetch failed");
    }
  };

  const fetchWeatherForCity = async () => {
    if (!selectedCity) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeather(
        selectedCity.id,
        selectedCity.name,
        "weather_forecast",
        selectedDate
      );
      setWeather(data.current);
      setForecastData(data.forecast);
      setHourlyData(data.hourly);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompareWeather = async (city) => {
    try {
      const data = await fetchWeather(city.id, city.name, "compare_forecast", selectedDate);
      setCompareWeather(data.current);
      setCompareForecastData(data.forecast);
      setCompareHourlyData(data.hourly);
    } catch (err) {
      console.error("Compare weather error:", err);
      setCompareWeather(null);
      setCompareForecastData([]);
      setCompareHourlyData([]);
    }
  };

  useEffect(() => {
    if (selectedCity) fetchWeatherForCity();
  }, [selectedCity, selectedDate]);

  useEffect(() => {
    if (compareCity) fetchCompareWeather(compareCity);
  }, [compareCity, selectedDate]);

  const handleCityChange = (newCity) => setSelectedCity(newCity);
  const handleCompareCityChange = async (newCity) => {
    setCompareCity(newCity);
    if (newCity) {
      await fetchCompareWeather(newCity);
    }
  };
  const handleOpenModal = () => {
    setModalTab(0);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);
  const handleTabChange = (event, newValue) => setModalTab(newValue);

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
            cities={cities}
            onCompareCityChange={handleCompareCityChange}
            compareCity={compareCity}
            compareWeather={{
              temperature: compareWeather?.temperature,
              description: compareWeather?.description,
              date: compareWeather?.date,
              icon: compareWeather?.icon,
            }}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            lat={locationDetails?.lat || 0}
            lon={locationDetails?.lng || 0}
            itineraryTip={locationDetails?.itineraryTip}
            photogenicForecastContent={locationDetails?.photogenicForecastContent}
            bestTimeToVisit={locationDetails?.bestTimeToVisit}
            photogenicForecastImages={locationDetails?.photogenicForecastImages}
            compareItineraryTip={compareLocationDetails?.itineraryTip}
            comparePhotogenicForecastContent={compareLocationDetails?.photogenicForecastContent}
            compareAdditionalField={compareLocationDetails?.additionalField}
            comparePhotogenicForecastImages={compareLocationDetails?.photogenicForecastImages}
            comparePhotogenicForecastLink={compareLocationDetails?.photogenicForecastLink}
            compareBestTimeToVisit={compareLocationDetails?.bestTimeToVisit}
            showCompare={showCompare}
            onToggleCompare={() => setShowCompare((prev) => !prev)}
            hourlyData={hourlyData}
            compareHourlyData={compareHourlyData}
            additionalField={locationDetails?.additionalField}
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
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Tabs value={modalTab} onChange={handleTabChange} centered>
            <Tab label={selectedCity?.name || "Selected City"} />
            {compareCity && <Tab label={compareCity.name} />}
          </Tabs>

          <Box sx={{ overflowY: "auto", flex: 1, mt: 2 }}>
            {modalTab === 0 && <ForecastCards forecastData={forecastData} />}
            {modalTab === 1 && compareCity && <ForecastCards forecastData={compareForecastData} />}
          </Box>
        </Box>
      </Modal>
    </>
  );
}
