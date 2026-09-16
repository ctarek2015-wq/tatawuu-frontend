const hasCoordinates = (location) => {
  return typeof location?.latitude === "number"
    && typeof location?.longitude === "number"
    && Number.isFinite(location.latitude)
    && Number.isFinite(location.longitude);
};

const directionsUrl = (location) => {
  const destination = hasCoordinates(location)
    ? `${location.latitude},${location.longitude}`
    : [location?.venue, location?.address, location?.area, location?.governorate, "Bahrain"].filter(Boolean).join(", ");
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
};

export { hasCoordinates, directionsUrl };
