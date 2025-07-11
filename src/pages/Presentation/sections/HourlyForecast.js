import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Divider, useTheme, useMediaQuery } from "@mui/material";
import { WiRain, WiSnow, WiDaySunny, WiCloudy, WiThunderstorm, WiFog } from "weather-icons-react";

const HourlyForecast = ({ hourlyData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!hourlyData || hourlyData.length === 0) {
    return (
      <Box textAlign="center" py={2}>
        <Typography variant="body2" color="text.secondary">
          Hourly forecast data not available
        </Typography>
      </Box>
    );
  }

  // ✅ Map WeatherAPI's condition text or icon path to weather-icons-react icon
  const getWeatherIcon = (conditionText) => {
    const size = isMobile ? 24 : 32;
    const text = conditionText?.toLowerCase() || "";

    if (text.includes("thunder")) return <WiThunderstorm size={size} color="#4B0082" />;
    if (text.includes("rain") || text.includes("drizzle") || text.includes("shower"))
      return <WiRain size={size} color="#4682B4" />;
    if (text.includes("snow") || text.includes("blizzard"))
      return <WiSnow size={size} color="#E0FFFF" />;
    if (text.includes("cloud") || text.includes("overcast"))
      return <WiCloudy size={size} color="#A9A9A9" />;
    if (text.includes("fog") || text.includes("mist") || text.includes("haze"))
      return <WiFog size={size} color="#A9A9A9" />;

    return <WiDaySunny size={size} color="#FFD700" />;
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Hourly Forecast
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          py: 1,
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.primary.main,
            borderRadius: "3px",
          },
        }}
      >
        {hourlyData.map((hour, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: isMobile ? 70 : 90,
              p: 1,
              borderRadius: 2,
              backgroundColor:
                theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              {hour.time}
            </Typography>
            <Box sx={{ my: 1 }}>{getWeatherIcon(hour.description, hour.icon)}</Box>
            <Typography variant="h6" fontWeight="bold">
              {hour.temp}°
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {hour.pop >= 1 ? Math.round(hour.pop) : Math.round(hour.pop)}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

HourlyForecast.propTypes = {
  hourlyData: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      temp: PropTypes.number.isRequired,
      feels_like: PropTypes.number,
      humidity: PropTypes.number,
      wind_speed: PropTypes.number,
      description: PropTypes.string, // ✅ Should be WeatherAPI's condition.text
      icon: PropTypes.string, // ✅ Can still be passed but not needed for mapping
      pop: PropTypes.number,
    })
  ),
};

HourlyForecast.defaultProps = {
  hourlyData: [],
};

export default HourlyForecast;
