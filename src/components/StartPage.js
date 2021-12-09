import { useContext, useState } from "react";
import MapChart from "./MapChart";
import { Heading } from "./shared/Heading";
import { Button, Col, Container, Row } from "react-bootstrap";
import { ThemeContext } from "./theme/ThemeContext";
import { LefSpinner } from "./shared/LefSpinner";
import { LefSelect } from "./shared/LefSelect";
import { useGetAllRegionsQuery } from "../redux/lefReduxApi";
import { getString } from "../assets/dictionary_de";
import * as PropTypes from "prop-types";
import { LayerEntry } from "./mainMap/LayerEntry";
// import { requestCreateRegion } from "../redux/dataSlice";

export const getTypeAheadOptions = (regions) => {
  let sortedRegions = [...regions];
  return sortedRegions
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .map((region) => ({
      label: region.name,
      value: region._id,
    }));
};

const StartPageCitySearch = ({ onCitySelect, regions, isFetchingRegions }) => {
  const [typeaheadText, setTypeaheadText] = useState("");
  return (
    <LefSelect
      value={typeaheadText}
      open={typeaheadText.length > 0}
      onInputChange={(text) => setTypeaheadText(text)}
      autoFocus
      style={{ width: "100%" }}
      id={"citySelection"}
      onChange={(values) => onCitySelect(values[0].value)}
      placeholder={"Stadt / Unternehmen"}
      options={getTypeAheadOptions(regions)}
      emptyLabel={isFetchingRegions ? "Lade Daten.." : "Keine Ergebnisse."}
    />
  );
};

export const StartPage = ({ onCitySelect = () => {} }) => {
  const { theme } = useContext(ThemeContext);
  const [coords, setCoords] = useState({});
  const { longitude, latitude } = coords;

  const LAYERS = [
    {
      name: "district",
      color: theme.colors.NAVIGATION_COLOR,
      label: "Kreise",
    },
    {
      name: "city",
      color: theme.colors.PRIMARY_COLOR_DARK,
      label: "Städte",
    },
    {
      name: "weatherStation",
      color: theme.colors.INTERACTIVE_ELEMENT_COLOR,
      label: "Wetterstationen",
    },
  ];

  const [shownLayers, setShownLayers] = useState(
    new Set(LAYERS.map((layer) => layer.name))
  );

  const {
    data: regions = [],
    isFetching: isFetchingRegions,
  } = useGetAllRegionsQuery();

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords(position.coords);
      },
      () => alert("Dein Standort konnte leider nicht ermittelt werden!")
    );
  };

  let infoBox = (
    <div className={"alert alert-secondary"}>
      <Heading size={"h4"} text={"Was ist das Local Emission Framework?"} />
      <p style={{ whiteSpace: "pre-wrap" }} className={"mt-2"}>
        {getString("aboutLef_text")}
      </p>
    </div>
  );
  const mainTitle = "Wie läuft der Klimaschutz in..";

  const toggleLayer = (name) => {
    let updatedShownLayers = new Set(shownLayers);
    if (updatedShownLayers.has(name)) {
      updatedShownLayers.delete(name);
    } else {
      updatedShownLayers.add(name);
    }
    setShownLayers(updatedShownLayers);
  };

  const convertedRegions = regions
    .filter((region) => shownLayers.has(region.type))
    .map((region) => ({
      ...region,
      color: LAYERS.find((layer) => layer.name === region.type)?.color,
    }));

  return (
    <div className={"col"}>
      {/*/!* <Button onClick={() => dispatch(requestCreateRegion("Demo-Region", []))}>*/}
      {/*   Neue Region*/}
      {/* </Button>*!/*/}

      <Container
        // fluid={"sm"}
        // className={"d-flex align-items-center justify-content-center m-0 p-0"}
        style={{ maxWidth: 1400 }}
        // style={{ height: 600 }}
      >
        <Col>
          <Row xs={12} className={"w-100"}>
            <Col
              md={12}
              lg={6}
              className={
                "d-flex align-items-center justify-content-center flex-column p-0"
              }
            >
              <Row xs={12} className={"mt-0 mt-md-2 mt-lg-0 w-100"}>
                <p className={"h1 d-md-none"}>{mainTitle}</p>
                <p className={"display-4 d-none d-md-block d-lg-none"}>
                  {mainTitle}
                </p>
                <p className={"display-3 d-none d-lg-block"}>{mainTitle}</p>
              </Row>
              <Col>
                <Row className={"w-100"}>
                  <StartPageCitySearch
                    regions={regions}
                    onCitySelect={onCitySelect}
                    isFetchingRegions={isFetchingRegions}
                  />
                </Row>
                <Row>
                  <Button
                    className={"mt-3"}
                    size={"sm"}
                    variant={"primary"}
                    onClick={() => getLocation()}
                  >
                    Meinen Standort verwenden
                  </Button>
                </Row>
              </Col>

              <Row className={"mt-3 mr-md-3"}>{infoBox}</Row>
            </Col>

            <Col
              className={"border border-light bg-light"}
              md={12}
              lg={6}
              // style={{ minHeight: 600 }}
            >
              <div className={"d-none d-md-block"}>
                {isFetchingRegions && (
                  <Container
                    style={{ height: "100%", fontSize: 12 }}
                    className={
                      "position-absolute w-100 d-flex align-items-center flex-wrap"
                    }
                  >
                    <Row xs={12} className={"w-100 h-100"}>
                      <LefSpinner text={"Wird geladen.."} />
                    </Row>
                  </Container>
                )}
              </div>
              <div
                style={{ bottom: 0, fontSize: 12 }}
                className={
                  "position-absolute w-100 d-flex align-items-start flex-column pb-2"
                }
              >
                <div
                  style={{
                    border: "1px solid #DDD",
                    borderRadius: 5,
                    backgroundColor: "#FFF",
                    opacity: 0.8,
                    padding: "5px 15px 5px 10px",
                  }}
                >
                  {LAYERS.map(({ name, color, label }) => (
                    <LayerEntry
                      color={color}
                      label={label}
                      onClick={() => toggleLayer(name)}
                      active={shownLayers.has(name)}
                    />
                  ))}
                </div>
              </div>
              <MapChart
                lat={latitude}
                lon={longitude}
                regions={convertedRegions}
                onRegionClick={(regionId) => onCitySelect(regionId)}
              />
            </Col>
          </Row>
        </Col>
      </Container>
    </div>
  );
};
