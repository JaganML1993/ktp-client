import React from "react";
import PropTypes from "prop-types";
import { Box, Paper, Typography, Grid } from "@mui/material";
import WeatherDetailItem from "./WeatherDetailItem";

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

export default ForecastCards;
