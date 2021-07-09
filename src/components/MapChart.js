import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import {
  COLOR_TEXT_BRIGHT,
  NAVIGATION_COLOR,
  SECONDARY_COLOR,
} from "../assets/colors";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const plzUrl = "https://emission-framework.org/assets/plz-gebiete_simpl.json";

const cities = [
  {
    lon: 7.626263414093006,
    lat: 51.96068624131465,
    label: "Münster",
  },
  {
    lon: 13.729963643455521,
    lat: 51.05513892485769,
    label: "Dresden",
  },
];

const getStyle = (geo, allPostalcodes) => ({
  fill: allPostalcodes.includes(geo.properties.plz)
    ? NAVIGATION_COLOR
    : COLOR_TEXT_BRIGHT,
  outline: "#FFF",
  stroke: "#646464",
  strokeWidth: 0.1,
  // strokeDasharray: "1,1",
  strokeLinejoin: "round",
});

const MapChart = ({ lon, lat, regions, onRegionClick }) => {
  const allPostalcodes = regions
    .map((region) => region.postalcodes)
    .reduce((a, b) => [...a, ...b], []);
  let postalcodeToRegionMap = {};
  regions.forEach((region) => {
    region.postalcodes.forEach((plz) => {
      postalcodeToRegionMap[plz] = region;
    });
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
            <circle r={10} fill={NAVIGATION_COLOR} />
          </Marker>
        )}
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default MapChart;
