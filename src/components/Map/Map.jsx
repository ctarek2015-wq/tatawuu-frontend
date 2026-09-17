import { useContext, useEffect, useRef, useState } from "react";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import { LanguageContext } from "../../contexts/LanguageContext.js";
import { hasCoordinates } from "../../utils/maps.js";

const pinIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

const Map = ({ latitude, longitude, onChange, editable = false }) => {
  const { t } = useContext(LanguageContext);
  const container = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const handleChange = useRef(onChange);
  const [tileError, setTileError] = useState(false);

  useEffect(() => {
    handleChange.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const instance = L.map(container.current, { zoomControl: false }).setView(
      [26.0667, 50.5577],
      10,
    );
    map.current = instance;
    const tiles = L.tileLayer(
      import.meta.env.VITE_MAP_TILE_URL ||
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          import.meta.env.VITE_MAP_ATTRIBUTION ||
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    );
    let failed = false;
    tiles.on("loading", () => {
      failed = false;
    });
    tiles.on("tileerror", () => {
      failed = true;
      setTileError(true);
    });
    tiles.on("load", () => {
      if (!failed) setTileError(false);
    });
    tiles.addTo(instance);
    if (editable) {
      instance.on("click", (event) => {
        handleChange.current({
          latitude: event.latlng.lat,
          longitude: event.latlng.lng,
        });
      });
    }
    return () => {
      instance.remove();
      map.current = null;
      marker.current = null;
    };
  }, [editable]);

  useEffect(() => {
    const control = L.control
      .zoom({ zoomInTitle: t("Zoom in"), zoomOutTitle: t("Zoom out") })
      .addTo(map.current);
    return () => control.remove();
  }, [t, editable]);

  useEffect(() => {
    if (!map.current) return;
    if (!hasCoordinates({ latitude, longitude })) {
      if (marker.current) marker.current.remove();
      marker.current = null;
      return;
    }
    if (marker.current) {
      marker.current.setLatLng([latitude, longitude]);
    } else {
      marker.current = L.marker([latitude, longitude], {
        icon: pinIcon,
        draggable: editable,
      }).addTo(map.current);
      if (editable) {
        marker.current.on("dragend", () => {
          const position = marker.current.getLatLng();
          handleChange.current({
            latitude: position.lat,
            longitude: position.lng,
          });
        });
      }
    }
    marker.current.getElement().setAttribute("alt", t("Location pin"));
    marker.current.getElement().setAttribute("title", t("Location pin"));
    map.current.setView(
      [latitude, longitude],
      Math.max(map.current.getZoom(), 15),
    );
  }, [latitude, longitude, editable, t]);

  const selectCenter = () => {
    const center = map.current.getCenter();
    onChange({ latitude: center.lat, longitude: center.lng });
  };

  return (
    <>
      <div
        ref={container}
        className="tatawwu-map"
        dir="ltr"
        role="region"
        aria-label={t(editable ? "Choose location on map" : "Location map")}
      />
      {tileError && (
        <p role="status">
          {t(
            "The map could not load. You can still save the address and try the map again later.",
          )}
        </p>
      )}
      {editable && (
        <button
          type="button"
          className="btn-soft btn-sm"
          onClick={selectCenter}
        >
          {t("Use map center")}
        </button>
      )}
    </>
  );
};

export default Map;
