import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import Map from "../Map/Map.jsx";
import { hasCoordinates } from "../../utils/maps.js";

const MapPicker = ({ latitude, longitude, onChange }) => {
  const { t } = useContext(LanguageContext);
  const selected = hasCoordinates({ latitude, longitude });
  return <fieldset className="map-picker">
    <legend>{t("Map location (optional)")}</legend>
    <p>{t("Click the map to choose a location, or drag the pin to move it.")}</p>
    <Map latitude={latitude} longitude={longitude} onChange={onChange} editable />
    {selected ? <>
      <p role="status">{t("Selected location")}: <bdi dir="ltr">{latitude.toFixed(5)}, {longitude.toFixed(5)}</bdi></p>
      <button type="button" className="btn-soft btn-sm" onClick={() => onChange({ latitude: null, longitude: null })}>{t("Remove pin")}</button>
    </> : <p>{t("No map location selected. Directions will use the written address.")}</p>}
  </fieldset>;
};

export default MapPicker;
