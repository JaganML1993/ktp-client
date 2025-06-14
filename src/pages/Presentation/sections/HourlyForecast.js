import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Divider, useTheme, useMediaQuery } from "@mui/material";
import { WiRain, WiSnow, WiDaySunny, WiCloudy, WiThunderstorm } from "weather-icons-react";

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

  const getWeatherIcon = (iconCode) => {
    const size = isMobile ? 24 : 32;
    switch (iconCode) {
      case "01d":
      case "01n":
        return <WiDaySunny size={size} color="#FFD700" />;
      case "02d":
      case "02n":
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        return <WiCloudy size={size} color="#A9A9A9" />;
      case "09d":
      case "09n":
      case "10d":
      case "10n":
        return <WiRain size={size} color="#4682B4" />;
      case "11d":
      case "11n":
        return <WiThunderstorm size={size} color="#4B0082" />;
      case "13d":
      case "13n":
        return <WiSnow size={size} color="#E0FFFF" />;
      default:
        return <WiDaySunny size={size} color="#FFD700" />;
    }
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
            <Box sx={{ my: 1 }}>{getWeatherIcon(hour.icon)}</Box>
            <Typography variant="h6" fontWeight="bold">
              {hour.temp}°
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {hour.pop}%
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
      description: PropTypes.string,
      icon: PropTypes.string.isRequired,
      pop: PropTypes.number,
    })
  ),
};

HourlyForecast.defaultProps = {
  hourlyData: [],
};

export default HourlyForecast;
