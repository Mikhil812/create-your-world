import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import continents from "./data/continents.geo.json";
// import custom from "./data/custom.geo.json"

export default function Map() {
  const mapContainer = useRef(null);

  const selectedContinentRef = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          empty: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: []
            }
          }
        },
        layers: [
          {
            id: "background",
            type: "background",
            paint: {
              "background-color": "#e6f2ff"
            }
          }
        ]
      },
      center: [0, 20], // longitude, latitude
      zoom: 1.5,
    });

    map.on("load", () => {
      // ADD GEOJSON SOURCE
      map.addSource("continents", {
        type: "geojson",
        data: continents,
        promoteId: "CONTINENT"
      });
  
      // ADD Default BORDER-ONLY LAYER
      map.addLayer({
        id: "continent-borders",
        type: "line",
        source: "continents",
        paint: {
          "line-color": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            "#ff0000",   // selected
            "#555555"    // default
          ],
          "line-width": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            4,
            2
          ]
        },
      });

      // Handle click selection : 
      map.on("click", "continent-borders", (e) => {
        const feature = e.features[0];
        console.log(feature);
        const id = feature.id;

        // Clear previous selection : 
        if(selectedContinentRef.current){
          map.setFeatureState(
            {source: "continents", id: selectedContinentRef.current},
            {selected: false}
          );
        }

        // Set new selection : 
        map.setFeatureState(
          {source: "continents", id},
          {selected: true}
        );
        
        selectedContinentRef.current = id;
        console.log("Selected Continent: ", feature.properties.CONTINENT);
      })

    });

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
