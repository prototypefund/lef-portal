import { useContext, useState } from "react";
import MapChart from "./MapChart";
import { Heading } from "./shared/Heading";
import { Col, Container, Row } from "react-bootstrap";
import { ThemeContext } from "./theme/ThemeContext";
import { LefSpinner } from "./shared/LefSpinner";
import { LefSelect } from "./shared/LefSelect";
import { useGetAllRegionsQuery } from "../redux/lefReduxApi";
import { getString } from "../assets/dictionary_de";
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
          <Row className={"mb-3 w-100"} xs={12}>
            {/*<Heading text={"Dein Klimacheck"} size={"h1"} />*/}
          </Row>
          <Row xs={12} className={"w-100"}>
            <Col
              md={12}
              lg={6}
              className={
                "d-flex align-items-center justify-content-center flex-column p-0"
              }
            >
              <Row xs={12} className={"mt-0 mt-md-2 mt-lg-5 w-100"}>
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
                {/*<Row>
                  <Button
                    className={"mt-3"}
                    size={"sm"}
                    variant={"primary"}
                    onClick={() => getLocation()}
                  >
                    Meinen Standort verwenden
                  </Button>
                </Row>*/}
              </Col>

              <Row className={"mt-5 mr-3"}>{infoBox}</Row>
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
                  "position-absolute w-100 d-flex align-items-center flex-column"
                }
              >
                <div className={"w-100 pl-2 p-1 d-flex align-items-center"}>
                  <div
                    style={{
                      backgroundColor: theme.colors.PRIMARY_COLOR_DARK,
                      color: "#FFF",
                      marginRight: 7,
                      borderRadius: 5,
                      width: 20,
                      height: 20,
                    }}
                  />
                  <span>Diese Orte sind schon dabei</span>
                </div>
                <div
                  className={"w-100 pl-2 pb-2 p-1 d-flex align-items-center"}
                >
                  <div
                    style={{
                      backgroundColor: theme.colors.NAVIGATION_COLOR,
                      color: "#FFF",
                      marginRight: 7,
                      borderRadius: 5,
                      width: 20,
                      height: 20,
                    }}
                  />
                  <span>nur Wetterdaten</span>
                </div>
              </div>
              <MapChart
                lat={latitude}
                lon={longitude}
                regions={regions}
                onRegionClick={(regionId) => onCitySelect(regionId)}
              />
            </Col>
          </Row>
        </Col>
      </Container>
    </div>
  );
};
