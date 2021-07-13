import React, { useContext } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ThemeContext } from "./theme/ThemeContext";

const plzUrl = "../assets/plz-gebiete_simpl.json";

const MapChart = ({ lon, lat, regions, onRegionClick }) => {
  const { theme } = useContext(ThemeContext);
  const { COLOR_TEXT_BRIGHT, NAVIGATION_COLOR } = theme.colors;
  const allPostalcodes = regions
    .map((region) => region.postalcodes)
    .reduce((a, b) => [...a, ...b], []);
  let postalcodeToRegionMap = {};
  regions.forEach((region) => {
    region.postalcodes.forEach((plz) => {
      postalcodeToRegionMap[plz] = region;
    });
  });

  const getStyle = (geo, allPostalcodes) => ({
    fill: allPostalcodes.includes(geo.properties.plz)
      ? NAVIGATION_COLOR
      : COLOR_TEXT_BRIGHT,
    outline: "#FFF",
    stroke: "#646464",
    strokeWidth: 0.1,
    // strokeDasharray: "1,1",
    strokeLinejoin: "round",
    fillOpacity: 0.8,
  });

  return (
    <ComposableMap
      // width={500}
      height={900}
      projection="geoAzimuthalEqualArea"
      projectionConfig={{
        rotate: [-10.5, -51.2, 0],
        scale: 5800,
      }}
    >
      <ZoomableGroup zoom={1}>
        {/*
        {cities.map((city) => (
          <Marker
            key={`${city.lon}/${city.lat}`}
            coordinates={[city.lon, city.lat]}
          >
            <circle r={5} fill={SECONDARY_COLOR} />
            <text
              textAnchor="middle"
              y={4}
              x={35}
              style={{
                fontFamily: "system-ui",
                fill: "#5D5A6D",
                fontSize: 10,
              }}
            >
              {city.label}
            </text>
          </Marker>
        ))}
*/}

        {lon && lat && (
          <Marker coordinates={[lon, lat]}>
            <circle r={20} fill={"green"} fillOpacity={1} />
          </Marker>
        )}

        <Geographies geography={plzUrl}>
          {({ geographies }) =>
            geographies.map((geo, j) => {
              const geosRegion = postalcodeToRegionMap[geo.properties.plz];
              const renderTooltip = (props) => (
                <Tooltip id="tooltip" {...props}>
                  {`${geo.properties.note}${
                    geosRegion ? ` (${geosRegion.name})` : ""
                  }`}
                </Tooltip>
              );
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
                      default: getStyle(geo, allPostalcodes),
                      pressed: getStyle(geo, allPostalcodes),
                    }}
                    onClick={(event) =>
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
