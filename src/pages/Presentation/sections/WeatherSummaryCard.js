import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Button,
  Grid,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Link,
  TextField,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Tooltip from "@mui/material/Tooltip";
import { Zoom } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";

const getPackingSuggestions = (temp, desc) => {
  const suggestions = [];
  const descLower = desc.toLowerCase();

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

function WeatherSummaryCard({
  temperature,
  description,
  date,
  icon,
  onViewForecast,
  selectedCity,
  onCityChange,
  cities,
  onCompareCityChange = () => {},
  compareCity = null,
  compareWeather = null,
  selectedDate,
  onDateChange,
  lat,
  lon,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showCompare, setShowCompare] = useState(false);
  const DEFAULT_ICON = "01d";
  const iconUrl = `https://openweathermap.org/img/wn/${icon || DEFAULT_ICON}@4x.png`;

  const [showMap, setShowMap] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  const toggleMap = () => setShowMap((prev) => !prev);

  const handleCompareToggle = () => {
    if (showCompare) {
      onCompareCityChange(null); // clear compare city
    }
    setShowCompare(!showCompare);
  };

  const renderCitySummary = (city, weatherData) => {
    const { temperature: temp, description: desc, date: dt, icon: ico } = weatherData;
    const iconUrl = `https://openweathermap.org/img/wn/${ico || DEFAULT_ICON}@4x.png`;

    return (
      <Box
        sx={{
          width: "100%",
          p: 2,
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {city.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dt}
            </Typography>
          </Box>
          <img
            src={iconUrl}
            alt={desc || "weather icon"}
            width={isMobile ? 40 : 60}
            height={isMobile ? 40 : 60}
            style={{
              filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.1))",
            }}
            onError={(e) => {
              e.target.src = `https://openweathermap.org/img/wn/${DEFAULT_ICON}@4x.png`;
            }}
          />
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            variant={isMobile ? "h4" : "h3"}
            color="primary"
            sx={{
              fontWeight: 300,
              fontSize: isMobile ? "2.5rem" : "3rem",
              lineHeight: 1,
            }}
          >
            {temp}°
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textTransform: "capitalize" }}>
            {desc}
          </Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            What to pack for {city.name}?
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {getPackingSuggestions(temp, desc)}
          </Box>
          <Typography variant="caption" color="text.primary" mt={1}>
            <strong>Itinerary Tip:</strong> Visit early morning to avoid heat.
          </Typography>
          <Box mt={1}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Photogenic Forecast
            </Typography>
            <Typography variant="body2" color="text.primary" gutterBottom>
              Sunset is at 6:24 PM – great lighting for beach photos!
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <img
                src="https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg"
                alt="Rainy Trail"
                width={100}
                height={70}
                style={{ borderRadius: 8, objectFit: "cover" }}
              />
              <img
                src="https://media.istockphoto.com/id/1432894575/photo/view-of-the-main-entrance-tower-of-jambukeswarar-temple-thiruvanaikaval-which-represent.jpg?s=612x612&w=0&k=20&c=exMeR-_PRybIBTgbZYu4nJR2L0D8KWYbrS2tLFzNq2o="
                alt="Cloudy Temple"
                width={100}
                height={70}
                style={{ borderRadius: 8, objectFit: "cover" }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  // Common styles for all form controls
  const formControlStyles = {
    flex: isMobile ? "none" : 1,
    minWidth: 180,
    "& .MuiOutlinedInput-root": {
      height: 56,
      borderRadius: 2,
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      "& .MuiSelect-select": {
        padding: "12px 32px 12px 16px",
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
    },
    "& .MuiInputLabel-root": {
      fontWeight: 500,
      color: theme.palette.primary.main,
    },
  };

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 3,
        boxShadow: 4,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        {/* Controls Row - Date, City, Compare */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            mb: 3,
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          <FormControl sx={formControlStyles}>
            <TextField
              fullWidth
              label="Select Date"
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => onDateChange(new Date(e.target.value))}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().split("T")[0],
                max: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              }}
            />
          </FormControl>

          <FormControl sx={formControlStyles}>
            <InputLabel id="city-select-label">Select City</InputLabel>
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
              {cities.map((city) => (
                <MenuItem key={city.name} value={city}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Link
              component="button"
              variant="body2"
              onClick={handleCompareToggle}
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 500,
                textDecoration: "none",
                whiteSpace: "nowrap",
                "&:hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
            >
              {showCompare ? "Cancel" : "Compare"}
            </Link>

            {showCompare && (
              <FormControl sx={formControlStyles}>
                <InputLabel id="compare-city-select-label">Compare City</InputLabel>
                <Select
                  labelId="compare-city-select-label"
                  id="compare-city-select"
                  value={compareCity}
                  label="Compare City"
                  onChange={(e) => onCompareCityChange(e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <span style={{ fontWeight: 600 }}>{selected?.name || ""}</span>
                    </Box>
                  )}
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
                  {cities.map((city) => (
                    <MenuItem key={`compare-${city.name}`} value={city}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>
        {/* Main Weather Content */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Button
            variant="text"
            size="small"
            sx={{
              position: "absolute",
              // top: 8,
              right: 8,
              // zIndex: 1,
              fontWeight: "bold",
            }}
            onClick={onViewForecast}
          >
            View Forecast
          </Button>
        </Box>

        {!showCompare ? (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {selectedCity.name}
                  <Tooltip title="Show location on map">
                    <IconButton onClick={toggleMap} size="small" color="primary">
                      <LocationOnIcon />
                    </IconButton>
                  </Tooltip>
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
                style={{
                  filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.1))",
                }}
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

            {/* Packing Suggestions */}
            {temperature !== null && (
              <Box mt={2}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  What to pack today?
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {getPackingSuggestions(temperature, description)}
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" color="text.primary" mt={1}>
                  <strong>Itinerary Tip:</strong> Visit early morning to avoid heat.
                </Typography>
                <Box mt={1}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Photogenic Forecast
                  </Typography>
                  <Typography variant="body2" color="text.primary" gutterBottom>
                    Sunset is at 6:24 PM – great lighting for beach photos!
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <img
                      src="https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg"
                      alt="Rainy Trail"
                      width={100}
                      height={70}
                      style={{ borderRadius: 8, objectFit: "cover" }}
                    />
                    <img
                      src="https://media.istockphoto.com/id/1432894575/photo/view-of-the-main-entrance-tower-of-jambukeswarar-temple-thiruvanaikaval-which-represent.jpg?s=612x612&w=0&k=20&c=exMeR-_PRybIBTgbZYu4nJR2L0D8KWYbrS2tLFzNq2o="
                      alt="Cloudy Temple"
                      width={100}
                      height={70}
                      style={{ borderRadius: 8, objectFit: "cover" }}
                    />
                  </Box>
                </Box>
              </Box>
            )}

            {showMap && (
              <Zoom in={showMap} mountOnEnter unmountOnExit>
                <Box mt={3} sx={{ width: "100%", height: 300, position: "relative" }}>
                  {/* Close Button */}
                  <IconButton
                    size="small"
                    onClick={toggleMap}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 3,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>

                  {/* Loading Spinner Overlay */}
                  {mapLoading && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.6)",
                        borderRadius: 2,
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  )}

                  {/* Embedded Google Map */}
                  <iframe
                    title="Google Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{
                      border: 0,
                      borderRadius: 8,
                      opacity: mapLoading ? 0 : 1,
                      transition: "opacity 0.3s ease",
                    }}
                    src={`https://www.google.com/maps?q=${lat},${lon}&z=14&output=embed`}
                    onLoad={() => setMapLoading(false)}
                    allowFullScreen
                  />
                </Box>
              </Zoom>
            )}
          </>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {renderCitySummary(selectedCity, {
                temperature,
                description,
                date,
                icon,
              })}
            </Grid>
            <Grid item xs={12} sm={6}>
              {compareCity && compareWeather && renderCitySummary(compareCity, compareWeather)}
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}

WeatherSummaryCard.propTypes = {
  temperature: PropTypes.number,
  description: PropTypes.string,
  date: PropTypes.string,
  icon: PropTypes.string,
  onViewForecast: PropTypes.func.isRequired,
  onCityChange: PropTypes.func.isRequired,
  selectedCity: PropTypes.object.isRequired,
  cities: PropTypes.array.isRequired,
  onCompareCityChange: PropTypes.func,
  compareCity: PropTypes.object,
  compareWeather: PropTypes.shape({
    temperature: PropTypes.number,
    description: PropTypes.string,
    date: PropTypes.string,
    icon: PropTypes.string,
  }),
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  onDateChange: PropTypes.func.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
};

WeatherSummaryCard.defaultProps = {
  temperature: null,
  description: "",
  date: "",
  icon: "01d",
  compareCity: null,
  compareWeather: null,
  onCompareCityChange: () => {},
};

export default WeatherSummaryCard;
