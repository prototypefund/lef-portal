import React, { useContext, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ThemeContext } from "./theme/ThemeContext";
import { useSelector } from "react-redux";

// const countries = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
const zipcodeAreas = require("../assets/plz-gebiete_simpl.json");
const states = require("../assets/3_mittel.geo.json");

const defaultLon = 10.5;
const defaultLat = 51.2;

const MapChart = ({ lon, lat, regions, onRegionClick }) => {
  const { theme } = useContext(ThemeContext);
  const { COLOR_TEXT_BRIGHT, NAVIGATION_COLOR } = theme.colors;
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const allPostalcodes = regions
    .map((region) => region.postalcodes)
    .reduce((a, b) => [...a, ...b], []);
  const postalcodeToRegionMap = {};
  regions.forEach((region) => {
    region.postalcodes.forEach((plz) => {
      postalcodeToRegionMap[plz] = region;
    });
  });

  const getStyle = (geo, allPostalcodes, geosRegion) => {
    const isHovered =
      hoveredRegion &&
      geosRegion &&
      geosRegion.postalcodes.includes(hoveredRegion);
    return {
      fill: isHovered
        ? "#444"
        : allPostalcodes.includes(geo.properties.plz)
        ? NAVIGATION_COLOR
        : COLOR_TEXT_BRIGHT,
      outline: "#FFF",
      stroke: isHovered ? "#444" : "#646464",
      strokeWidth: 0.1,
      // strokeDasharray: "1,1",
      strokeLinejoin: "round",
      fillOpacity: 0.8,
    };
  };

  const rotateLon = lon || defaultLon;
  const rotateLat = lat || defaultLat;
  return (
    <ComposableMap
      // width={500}
      height={900}
      projection="geoAzimuthalEqualArea"
      projectionConfig={{
        rotate: [-rotateLon, -rotateLat, 0],
        scale: 5800,
      }}
    >
      <ZoomableGroup
        zoom={lon ? 4 : 1}
        center={[rotateLon, rotateLat]}
        translateExtent={[
          [0, 0],
          [800, 900],
        ]}
      >
        {lon && lat && (
          <Marker coordinates={[lon, lat]}>
            <circle r={20} fill={"green"} fillOpacity={1} />
          </Marker>
        )}

        <Geographies geography={states}>
          {({ geographies }) =>
            geographies.map((geo, j) => {
              const geosRegion = postalcodeToRegionMap[geo.properties.plz];
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: getStyle(geo, allPostalcodes),
                    hover: getStyle(geo, allPostalcodes),
                  }}
                  onClick={(event) =>
                    geosRegion && onRegionClick(geosRegion._id)
                  }
                />
              );
            })
          }
        </Geographies>
        <Geographies geography={zipcodeAreas}>
          {({ geographies }) =>
            geographies
              .filter((geo) => allPostalcodes.includes(geo.properties.plz))
              .map((geo, j) => {
                const geosRegion = postalcodeToRegionMap[geo.properties.plz];
                const renderTooltip = (props) => (
                  <Tooltip id="tooltip" {...props}>
                    {`${geo.properties.note}${
                      geosRegion ? ` (${geosRegion.name})` : ""
                    }`}
                  </Tooltip>
                );
                const style = getStyle(geo, allPostalcodes, geosRegion);
                return (
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                  >
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: style,
                        hover: style,
                        pressed: style,
                      }}
                      onMouseEnter={() => setHoveredRegion(geo.properties.plz)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() =>
                        geosRegion && onRegionClick(geosRegion._id)
                      }
                    />
                  </OverlayTrigger>
                );
              })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default MapChart;
