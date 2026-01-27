import {useEffect, useRef, useState} from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import continents from "./data/continents.geojson"

export default function Map(){
  const mapContainer = useRef(null);

  const[coords, setCoords] = useState(null);
  const markerRef = useRef(null);

  useEffect(()=> {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [0, 20],
      zoom: 1.5,
    });

    map.on("load", () => {
      map.addSource("continents", {
        type: "geojson",
        data: continents,
      });

      map.addLayer({
        id: "continent-borders",
        type: "line",
        source: "continents",
        paint: {
          "line-color": "#000",
          "line-width": 2,
        },
      });
    });

    // Click Event Handler
    const handleClick = (event) => {
      const {lng, lat} = event.lngLat;
      const zoom = map.getZoom();

      setCoords({lng, lat});

      if(markerRef.current){
        markerRef.current.remove();
      }
      markerRef.current = new maplibregl.Marker()
        .setLngLat([lng, lat])
        .addTo(map);
    }
    map.on("click", handleClick);

    return() => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      map.off("click", handleClick);
      map.remove();
    };
  }, []);

  return (
    <>
      <div 
        ref={mapContainer}
        style={{width:"100%", height: "100%"}}
      />
      {coords && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            background: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          <div><strong>Longitude:</strong> {coords.lng.toFixed(4)}</div>
          <div><strong>Latitude:</strong> {coords.lat.toFixed(4)}</div>
        </div>
      )}
    </>
  );
}


