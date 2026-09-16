import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import Map from "../Map/Map.jsx";
import { hasCoordinates, directionsUrl } from "../../utils/maps.js";

const LocationMap = ({ location }) => {
  const { t } = useContext(LanguageContext);
  if (!location) return null;
  return <div>
    {hasCoordinates(location) && <Map latitude={location.latitude} longitude={location.longitude} />}
    <p><a href={directionsUrl(location)} target="_blank" rel="noreferrer">{t("Get directions")} <span aria-hidden="true">↗</span></a></p>
  </div>;
};

export default LocationMap;
