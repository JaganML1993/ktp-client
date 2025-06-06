import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  useTheme,
  Divider,
  Button,
  Modal,
  Paper,
  IconButton,
  Grid,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";

// Weather Card Component
function WeatherSummaryCard({
  temperature,
  description,
  date,
  icon,
  onViewForecast,
  selectedCity,
  onCityChange,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const DEFAULT_ICON = "01d";
  const iconUrl = `https://openweathermap.org/img/wn/${icon || DEFAULT_ICON}@4x.png`;

  const CITIES = [
    { name: "Bangalore", lat: 12.956705079821537, lon: 77.70017294132057 },
    { name: "Mumbai", lat: 19.076, lon: 72.8777 },
    { name: "Delhi", lat: 28.7041, lon: 77.1025 },
    { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
    { name: "Chennai", lat: 13.0827, lon: 80.2707 },
    { name: "Hyderabad", lat: 17.385, lon: 78.4867 },
    { name: "Pune", lat: 18.5204, lon: 73.8567 },
  ];

  return (
    <Card
      sx={{
        width: "100%", // Take full width of grid item
        borderRadius: 3,
        boxShadow: 4,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Grid container spacing={2}>
          {/* City Selector Dropdown - First Column */}
          <Grid item xs={12} md={5}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel
                id="city-select-label"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.primary.main,
                }}
              >
                Select City
              </InputLabel>
              <Select
                labelId="city-select-label"
                id="city-select"
                value={selectedCity}
                label="Select City"
                onChange={(e) => onCityChange(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontWeight: 600 }}>{selected.name}</span>
                  </Box>
                )}
                sx={{
                  height: 56, // Increased height
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  "& .MuiSelect-select": {
                    padding: "12px 32px 12px 16px", // More padding
                    fontSize: "1rem",
                    fontWeight: 500,
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2,
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: 3,
                      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                      marginTop: 1,
                      "& .MuiMenuItem-root": {
                        padding: "12px 16px",
                        fontWeight: 500,
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                        "&.Mui-selected": {
                          backgroundColor: theme.palette.primary.light,
                          fontWeight: 600,
                        },
                      },
                    },
                  },
                }}
              >
                {CITIES.map((city) => (
                  <MenuItem
                    key={city.name}
                    value={city}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      "& .MuiSvgIcon-root": {
                        marginRight: 2,
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {temperature !== null && (
              <Box mt={2}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  What to pack today?
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {getPackingSuggestions(temperature, description)}
                </Box>
              </Box>
            )}
          </Grid>

          {/* Weather Info - Second Column */}
          <Grid item xs={12} md={7}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {selectedCity.name}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {date}
                </Typography>
              </Box>
              <img
                src={iconUrl}
                alt={description || "weather icon"}
                width={isMobile ? 60 : 80}
                height={isMobile ? 60 : 80}
                style={{ filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.1))" }}
                onError={(e) => {
                  e.target.src = `https://openweathermap.org/img/wn/${DEFAULT_ICON}@4x.png`;
                }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography
                variant={isMobile ? "h3" : "h2"}
                color="primary"
                sx={{
                  fontWeight: 300,
                  fontSize: isMobile ? "3rem" : "4rem",
                  lineHeight: 1,
                  textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                {temperature}°
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                {description}
              </Typography>
            </Box>

            <Button
              variant="text"
              color="primary"
              onClick={onViewForecast}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              View 7-Day Forecast
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

// Update propTypes to remove city prop
WeatherSummaryCard.propTypes = {
  temperature: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  icon: PropTypes.string,
  onViewForecast: PropTypes.func.isRequired,
  onCityChange: PropTypes.func.isRequired,
  selectedCity: PropTypes.object.isRequired,
};

WeatherSummaryCard.defaultProps = {
  temperature: null,
  icon: "01d",
};

// Add this function inside the WeatherSummaryCard component
const getPackingSuggestions = (temp, desc) => {
  const suggestions = [];
  const descLower = desc.toLowerCase();

  // Temperature-based suggestions
  if (temp >= 30) {
    suggestions.push({ label: "Light clothing", emoji: "👕" });
    suggestions.push({ label: "Sunglasses", emoji: "🕶️" });
    suggestions.push({ label: "Sun hat", emoji: "👒" });
    suggestions.push({ label: "Sunscreen", emoji: "🧴" });
  } else if (temp >= 20 && temp < 30) {
    suggestions.push({ label: "Light layers", emoji: "👚" });
  } else if (temp < 20) {
    suggestions.push({ label: "Jacket", emoji: "🧥" });
    suggestions.push({ label: "Sweater", emoji: "🧶" });
  }

  // Weather condition-based suggestions
  if (descLower.includes("rain") || descLower.includes("drizzle")) {
    suggestions.push({ label: "Umbrella", emoji: "☔" });
    suggestions.push({ label: "Raincoat", emoji: "🧥" });
    suggestions.push({ label: "Waterproof shoes", emoji: "👢" });
  }
  if (descLower.includes("snow") || descLower.includes("blizzard")) {
    suggestions.push({ label: "Winter jacket", emoji: "🧥" });
    suggestions.push({ label: "Gloves", emoji: "🧤" });
    suggestions.push({ label: "Beanie", emoji: "🧢" });
  }
  if (descLower.includes("wind") || descLower.includes("breez")) {
    suggestions.push({ label: "Windbreaker", emoji: "🧥" });
  }
  if (descLower.includes("sun") || descLower.includes("clear")) {
    if (!suggestions.some((s) => s.label === "Sunglasses")) {
      suggestions.push({ label: "Sunglasses", emoji: "🕶️" });
    }
    if (!suggestions.some((s) => s.label === "Sunscreen")) {
      suggestions.push({ label: "Sunscreen", emoji: "🧴" });
    }
  }

  // Remove duplicates
  const uniqueSuggestions = suggestions.filter(
    (s, index, self) => index === self.findIndex((t) => t.label === s.label)
  );

  return uniqueSuggestions.map((item, index) => (
    <Chip
      key={index}
      label={`${item.emoji} ${item.label}`}
      variant="outlined"
      size="small"
      sx={{
        borderRadius: 1,
        backgroundColor: "rgba(255,255,255,0.3)",
        border: "none",
      }}
    />
  ));
};

function ForecastCards({ forecastData }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 1,
        maxHeight: "60vh",
        overflowY: "auto",
      }}
    >
      {forecastData.map((day, index) => (
        <Paper
          key={index}
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 3,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          }}
        >
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {new Date(day.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
                width={40}
                height={40}
              />
              <Typography variant="body2" sx={{ textTransform: "capitalize", ml: 1 }}>
                {day.description}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={1} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <WeatherDetailItem label="Day" value={`${Math.round(day.dayTemp)}°C`} icon="☀️" />
            </Grid>
            <Grid item xs={6}>
              <WeatherDetailItem label="Night" value={`${Math.round(day.nightTemp)}°C`} icon="🌙" />
            </Grid>
            <Grid item xs={6}>
              <WeatherDetailItem
                label="Range"
                value={`${Math.round(day.minTemp)}°/${Math.round(day.maxTemp)}°`}
                icon="🌡️"
              />
            </Grid>
            <Grid item xs={6}>
              <WeatherDetailItem label="Humidity" value={`${day.humidity}%`} icon="💧" />
            </Grid>
            <Grid item xs={6}>
              <WeatherDetailItem
                label="Wind"
                value={`${Math.round(day.windSpeed * 3.6)} km/h`}
                icon="🌬️"
              />
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
}

ForecastCards.propTypes = {
  forecastData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      dayTemp: PropTypes.number.isRequired,
      nightTemp: PropTypes.number.isRequired,
      minTemp: PropTypes.number.isRequired,
      maxTemp: PropTypes.number.isRequired,
      humidity: PropTypes.number.isRequired,
      windSpeed: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
};

function WeatherDetailItem({ label, value, icon }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        backgroundColor: "rgba(255,255,255,0.3)",
        borderRadius: 2,
      }}
    >
      <Typography variant="body2" sx={{ mr: 1 }}>
        {icon}
      </Typography>
      <Box>
        <Typography variant="caption" display="block" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

WeatherDetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

// Main Component
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState({
    name: "Bangalore",
    lat: 12.956705079821537,
    lon: 77.70017294132057,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const fetchWeatherForCity = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
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

      // Fetch new data
      const apiUrl = `${baseUrl}/api/weather/forecast-days?lat=${lat}&lon=${lon}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const apiData = await response.json();

      if (apiData.status === "success" && Array.isArray(apiData.data) && apiData.data.length > 0) {
        const firstDay = apiData.data[0];
        const weatherInfo = firstDay.weather[0];

        // In fetchWeatherForCity function
        const currentWeather = {
          city: selectedCity.name, // Use selectedCity.name instead of hardcoded city
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
              7-Day Forecast for {selectedCity.name}
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

// Helper Components
function LoadingSkeleton() {
  return (
    <Card
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        borderRadius: 3,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Box>
            <Skeleton variant="text" width={120} height={40} />
            <Skeleton variant="text" width={180} height={24} />
          </Box>
          <Skeleton variant="circular" width={80} height={80} />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Skeleton variant="text" width={100} height={80} />
          <Skeleton variant="text" width={120} height={40} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
      </CardContent>
    </Card>
  );
}

function ErrorCard({ error }) {
  return (
    <Card
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 3,
        backgroundColor: "error.light",
      }}
    >
      <Typography color="error" variant="body1" sx={{ fontWeight: 500 }}>
        Error loading weather data: {error}
      </Typography>
    </Card>
  );
}

ErrorCard.propTypes = {
  error: PropTypes.string.isRequired,
};

function NoDataCard() {
  return (
    <Card
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 3,
        backgroundColor: "warning.light",
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        No weather data available
      </Typography>
    </Card>
  );
}
