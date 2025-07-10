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
import * as he from "he";
import DOMPurify from "dompurify";
import HourlyForecast from "./HourlyForecast";
import Autocomplete from "@mui/material/Autocomplete";

// SafeHtml component with proper prop validation
const SafeHtml = ({ html }) => {
  if (!html) return null;

  const decoded = he.decode(html);
  const clean = DOMPurify.sanitize(decoded);

  return <span dangerouslySetInnerHTML={{ __html: clean }} />;
};

SafeHtml.propTypes = {
  html: PropTypes.string,
};

const getPackingSuggestions = (temp, desc = "") => {
  const suggestions = [];
  const descLower = desc?.toLowerCase?.() || "";

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
  itineraryTip,
  photogenicForecastContent,
  additionalField,
  photogenicForecastImages,
  photogenicForecastLink,
  compareItineraryTip,
  comparePhotogenicForecastContent,
  compareAdditionalField,
  comparePhotogenicForecastImages,
  comparePhotogenicForecastLink,
  showCompare,
  onToggleCompare,
  hourlyData,
  compareHourlyData,
  bestTimeToVisit,
  compareBestTimeToVisit,
  dangerAlert,
  compareDangerAlert,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const DEFAULT_ICON = "01d";
  const iconUrl = `https://openweathermap.org/img/wn/${icon || DEFAULT_ICON}@4x.png`;

  const [showMap, setShowMap] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  const toggleMap = () => setShowMap((prev) => !prev);

  const handleCompareToggle = () => {
    if (showCompare) {
      onCompareCityChange(null); // clear compare city
    }
    onToggleCompare();
  };

  const renderCitySummary = (city, weatherData, locationDetails = {}) => {
    const { temperature: temp, description: desc, date: dt, icon: ico } = weatherData;
    const iconUrl = `https://openweathermap.org/img/wn/${ico || DEFAULT_ICON}@4x.png`;
    const {
      itineraryTip,
      photogenicForecastContent,
      additionalField,
      bestTimeToVisit,
      photogenicForecastImages,
      photogenicForecastLink,
    } = locationDetails;

    if (!city) {
      return (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Loading city data...
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          width: "100%",
          p: 2,
          borderRadius: 2,
          // backgroundColor: "rgba(0, 0, 0, 0.08)",
          // boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          className="temperature_section"
          alignItems="center"
          mb={2}
        >
          <Box>
            {/* City Name + Map Icon */}
            <Box display="flex" alignItems="center">
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mr: 1 }}>
                {city?.name || "Select a city"}
              </Typography>
              {/* <Tooltip title="Show location on map">
                <IconButton onClick={toggleMap} size="small">
                  <LocationOnIcon sx={{ color: "error.main" }} />
                </IconButton>
              </Tooltip> */}
            </Box>

            {/* Date/Time */}
            <Typography variant="subtitle2" color="text.secondary">
              {dt}
            </Typography>

            {/* Temperature + Description */}
            <Box display="flex" alignItems="center" mt={2}>
              <Typography
                variant={isMobile ? "h3" : "h2"}
                color="#59b10a"
                sx={{
                  fontWeight: 300,
                  fontSize: isMobile ? "3rem" : "4rem",
                  lineHeight: 1,
                  textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
                  color: "#43bf43 !important",
                  mr: 2,
                }}
              >
                {temp}°
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                {desc}
              </Typography>
            </Box>
          </Box>

          {/* Weather Icon */}
          <img
            src={iconUrl}
            alt={desc || "weather icon"}
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
        <Divider sx={{ my: 1 }} />

        {/* Hourly Forecast Section */}
        <Box mt={2}>
          {weatherData.hourly && weatherData.hourly.length > 0 ? (
            <>
              <HourlyForecast hourlyData={weatherData.hourly} />
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Hourly data not available for {city.name}
            </Typography>
          )}
        </Box>

        {locationDetails.dangerAlert && (
          <Box
            mt={2}
            sx={{ backgroundColor: "rgba(0,0,0,0.08) !important", p: 2, borderRadius: 2 }}
          >
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{
                color: "#bb3030 !important",
              }}
              color="error.main"
              gutterBottom
            >
              ⚠️ Danger Alert
            </Typography>
            <Typography variant="body2" component="div" color="text.primary">
              <SafeHtml html={locationDetails.dangerAlert} />
            </Typography>
          </Box>
        )}

        <Box mt={2} className="pack_section">
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            What to pack for {city.name}?
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {getPackingSuggestions(temp, desc)}
          </Box>
          {/* Itinerary Tip Section */}
          <Box mt={1}>
            <Typography variant="subtitle2" component="div" fontWeight="bold" gutterBottom>
              Itinerary Tip:
            </Typography>
            <Typography
              variant="body2"
              className="itinerary_section"
              component="div"
              color="text.primary"
            >
              <SafeHtml html={itineraryTip} />
            </Typography>
          </Box>
          <Box mt={1}>
            <Typography variant="subtitle2" component="div" fontWeight="bold" gutterBottom>
              Photogenic Forecast
            </Typography>
            <Typography
              variant="body2"
              className="itinerary_section"
              component="div"
              color="text.primary"
              gutterBottom
            >
              <SafeHtml html={photogenicForecastContent} />
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
              {photogenicForecastImages?.map((src, idx) => {
                const imageUrl = src.startsWith("http")
                  ? src
                  : `${process.env.REACT_APP_API_BASE_URL}/uploads/${src.replace(
                      /^uploads[\\/]/,
                      ""
                    )}`;

                const decodedLink = photogenicForecastLink
                  ? photogenicForecastLink.replace(/&#x2F;/g, "/").replace(/&amp;/g, "&")
                  : null;

                const isValidLink = decodedLink && decodedLink !== "#" && decodedLink.trim() !== "";

                return (
                  <Box
                    key={idx}
                    component={isValidLink ? "a" : "div"}
                    href={isValidLink ? decodedLink : undefined}
                    target={isValidLink ? "_blank" : undefined}
                    rel={isValidLink ? "noopener noreferrer" : undefined}
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      display: "inline-block",
                      transition: "transform 0.3s ease",
                      pointerEvents: isValidLink ? "auto" : "none",
                      opacity: isValidLink ? 1 : 0.6,
                      "&:hover img": {
                        transform: isValidLink ? "scale(1.25)" : "none",
                      },
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={`Photogenic ${idx + 1}`}
                      width={100}
                      height={70}
                      style={{
                        borderRadius: 8,
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box mt={1}>
            <Typography variant="subtitle2" component="div" fontWeight="bold" gutterBottom>
              {additionalField}
            </Typography>
            <Typography
              variant="body2"
              className="itinerary_section"
              component="div"
              color="text.primary"
              gutterBottom
            >
              <SafeHtml html={bestTimeToVisit} />
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  // Common styles for all form controls
  const formControlStyles = {
    flex: isMobile ? "none" : 1,
    minWidth: {
      xs: 220, // extra small screens (e.g. phones)
      sm: 220, // small screens (e.g. tablets)
      md: 180, // medium screens and up
    },
    "& .MuiOutlinedInput-root": {
      height: 56,
      borderRadius: 2,
      backgroundColor: "transparent",
      boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
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
        background:
          "linear-gradient(to top, lightgrey 0%, lightgrey 1%, #e0e0e0 26%, #efefef 48%, #d9d9d9 75%, #bcbcbc 100%);",
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
              value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
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
            <Autocomplete
              options={cities}
              getOptionLabel={(option) => option.name || ""}
              value={selectedCity || null}
              onChange={(event, newValue) => {
                if (newValue) onCityChange(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ color: "#c8c8c8 !important" }}
                  label="Select City"
                  variant="outlined"
                  fullWidth
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
            />
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
                <Autocomplete
                  options={cities}
                  getOptionLabel={(option) => option.name || ""}
                  value={compareCity || null}
                  onChange={(event, newValue) => onCompareCityChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Compare City"
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }} // optional
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                />
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
              right: 8,
              fontWeight: "bold",
              color: "#004C70",
            }}
            onClick={onViewForecast}
          >
            View Forecast
          </Button>
        </Box>

        {!showCompare ? (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              className="temperature_section"
              alignItems="center"
              mb={2}
            >
              <Box>
                <Box display="flex" alignItems="center">
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mr: 1 }}>
                    {selectedCity?.name || "Select a city"}
                  </Typography>
                  <Tooltip title="Show location on map">
                    <IconButton onClick={toggleMap} size="small">
                      <LocationOnIcon sx={{ color: "error.main" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {date}
                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  <Typography
                    variant={isMobile ? "h3" : "h2"}
                    color="#59b10a"
                    sx={{
                      fontWeight: 300,
                      fontSize: isMobile ? "3rem" : "4rem",
                      lineHeight: 1,
                      textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
                      color: "#43bf43 !important",
                      mr: 2,
                    }}
                  >
                    {temperature}°
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {description}
                  </Typography>
                </Box>
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
                      // backgroundColor: "rgba(255, 255, 255, 0.8)",
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

            {/* Add Hourly Forecast here */}
            <Box mt={2}>
              <HourlyForecast hourlyData={hourlyData} />
            </Box>
            {/* Packing Suggestions */}
            {dangerAlert && (
              <Box
                mt={2}
                sx={{
                  backgroundColor: "rgba(0,0,0,0.08) !important",
                  p: 2,
                  borderRadius: 2,
                  color: "red",
                  // border: "1px solid #ffa726",
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{
                    color: "#bb3030 !important",
                  }}
                  gutterBottom
                >
                  ⚠️ Danger Alert
                </Typography>
                <Typography variant="body2" component="div" color="text.primary">
                  <SafeHtml html={dangerAlert} />
                </Typography>
              </Box>
            )}

            {temperature !== null && (
              <Box mt={2} className="pack_section">
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  What to pack?
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {getPackingSuggestions(temperature, description)}
                </Box>
                {/* Itinerary Tip Section */}
                <Box mt={1}>
                  <Typography variant="subtitle2" component="div" fontWeight="bold" gutterBottom>
                    Itinerary Tip:
                  </Typography>
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{
                      marginLeft: "20px !important",
                    }}
                    color="text.primary"
                  >
                    <SafeHtml html={itineraryTip} />
                  </Typography>
                </Box>
                <Box mt={1}>
                  <Typography variant="subtitle2" component="div" fontWeight="bold" gutterBottom>
                    Photogenic Forecast
                  </Typography>
                  <Typography
                    variant="body2"
                    className="itinerary_section"
                    component="div"
                    color="text.primary"
                    gutterBottom
                  >
                    <SafeHtml html={photogenicForecastContent} />
                  </Typography>

                  <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
                    {photogenicForecastImages?.map((src, idx) => {
                      const imageUrl = src.startsWith("http")
                        ? src
                        : `${process.env.REACT_APP_API_BASE_URL}/uploads/${src.replace(
                            /^uploads[\\/]/,
                            ""
                          )}`;

                      const decodedLink = photogenicForecastLink
                        ? he.decode(photogenicForecastLink)
                        : null;

                      const isValidLink =
                        decodedLink && decodedLink !== "#" && decodedLink.trim() !== "";

                      return (
                        <Box
                          key={idx}
                          component={isValidLink ? "a" : "div"}
                          href={isValidLink ? decodedLink : undefined}
                          target={isValidLink ? "_blank" : undefined}
                          rel={isValidLink ? "noopener noreferrer" : undefined}
                          sx={{
                            borderRadius: 2,
                            overflow: "hidden",
                            display: "inline-block",
                            transition: "transform 0.3s ease",
                            pointerEvents: isValidLink ? "auto" : "none",
                            opacity: isValidLink ? 1 : 0.6,
                            "&:hover img": {
                              transform: isValidLink ? "scale(1.25)" : "none",
                            },
                          }}
                        >
                          <img
                            src={imageUrl}
                            alt={`Photogenic ${idx + 1}`}
                            width={100}
                            height={70}
                            style={{
                              borderRadius: 8,
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                <Box mt={1}>
                  <Typography variant="subtitle2" component="div" fontWeight="bold" gutterBottom>
                    {additionalField}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="itinerary_section"
                    component="div"
                    color="text.primary"
                    gutterBottom
                  >
                    <SafeHtml html={bestTimeToVisit} />
                  </Typography>
                </Box>
              </Box>
            )}
          </>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {renderCitySummary(
                selectedCity,
                {
                  temperature,
                  description,
                  date,
                  icon,
                  hourly: hourlyData,
                },
                {
                  itineraryTip,
                  photogenicForecastContent,
                  additionalField,
                  photogenicForecastImages,
                  photogenicForecastLink,
                  bestTimeToVisit: bestTimeToVisit,
                  dangerAlert,
                }
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {compareCity ? (
                compareWeather ? (
                  renderCitySummary(
                    compareCity,
                    {
                      temperature: compareWeather.temperature,
                      description: compareWeather.description,
                      date: compareWeather.date,
                      icon: compareWeather.icon,
                      hourly: compareHourlyData,
                    },
                    {
                      itineraryTip: compareItineraryTip,
                      photogenicForecastContent: comparePhotogenicForecastContent,
                      additionalField: compareAdditionalField,
                      bestTimeToVisit: compareBestTimeToVisit,
                      photogenicForecastImages: comparePhotogenicForecastImages,
                      photogenicForecastLink: comparePhotogenicForecastLink,
                      dangerAlert: compareDangerAlert,
                    }
                  )
                ) : (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography>Weather data not available</Typography>
                  </Box>
                )
              ) : (
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Typography>Select a city to compare</Typography>
                </Box>
              )}
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
  itineraryTip: PropTypes.string,
  photogenicForecastContent: PropTypes.string,
  additionalField: PropTypes.string,
  photogenicForecastImages: PropTypes.arrayOf(PropTypes.string),
  photogenicForecastLink: PropTypes.string,
  compareItineraryTip: PropTypes.string,
  comparePhotogenicForecastContent: PropTypes.string,
  compareAdditionalField: PropTypes.string,
  comparePhotogenicForecastImages: PropTypes.arrayOf(PropTypes.string),
  comparePhotogenicForecastLink: PropTypes.string,
  showCompare: PropTypes.bool.isRequired,
  onToggleCompare: PropTypes.func.isRequired,
  hourlyData: PropTypes.array,
  compareHourlyData: PropTypes.array,
  bestTimeToVisit: PropTypes.string,
  compareBestTimeToVisit: PropTypes.string,
  dangerAlert: PropTypes.string,
  compareDangerAlert: PropTypes.string,
};

WeatherSummaryCard.defaultProps = {
  temperature: null,
  description: "",
  date: "",
  icon: "01d",
  compareCity: null,
  compareWeather: null,
  onCompareCityChange: () => {},
  itineraryTip: "",
  photogenicForecastContent: "",
  additionalField: "Best Time to Visit",
  photogenicForecastImages: [],
  photogenicForecastLink: "#",
  compareItineraryTip: "",
  comparePhotogenicForecastContent: "",
  compareAdditionalField: "Best Time to Visit",
  comparePhotogenicForecastImages: [],
  comparePhotogenicForecastLink: "#",
  hourlyData: [],
  compareHourlyData: [],
  bestTimeToVisit: "",
  compareBestTimeToVisit: "",
  dangerAlert: "",
  compareDangerAlert: "",
};

export default WeatherSummaryCard;
