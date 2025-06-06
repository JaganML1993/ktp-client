import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

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

export default WeatherDetailItem;
