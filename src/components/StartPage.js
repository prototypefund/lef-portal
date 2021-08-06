import { useContext, useState } from "react";
import MapChart from "./MapChart";
import { Heading } from "./shared/Heading";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ThemeContext } from "./theme/ThemeContext";
import { LefSpinner } from "./shared/LefSpinner";
import { LefSelect } from "./shared/LefSelect";
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

export const StartPage = ({ onCitySelect = () => {} }) => {
  const { theme } = useContext(ThemeContext);
  const regions = useSelector((state) => state.data.regionData);
  const [coords, setCoords] = useState({});
  const [typeaheadText, setTypeaheadText] = useState("");
  const { longitude, latitude } = coords;
  const isFetchingRegions = useSelector(
    (state) => state.data.isFetchingAllRegions
  );
  // const dispatch = useDispatch();

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // const latitude = position.coords.latitude;
        // const longitude = position.coords.longitude;
        setCoords(position.coords);
        // TODO find region closest to user location
      },
      () => alert("Dein Standort konnte leider nicht ermittelt werden!")
    );
  };

  let infoBox = (
    <div className={"alert alert-secondary"}>
      <Heading size={"h4"} text={"Was ist das Local Emission Framework?"} />
      <p style={{ whiteSpace: "pre-wrap" }} className={"mt-2"}>
        {
          "Über den Klimaschutz wird viel geredet - aber du fragst dich, was sich ganz konkret vor deiner Haustür tut? Was unternehmen deine Kommune, dein Kreis und die Unternehmen in deiner Region in Sachen Klima? Sind die Folgen des Klimawandels bereits bei dir zu spüren?\n\nWir erklären dir kurz und bündig, was bisher schon an Klimaschutzmaßnahmen passiert ist, wo wir gerade stehen und was in Zukunft noch geplant ist."
        }
      </p>
    </div>
  );
  let mainTitle = "Wie läuft der Klimaschutz in..";
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
                    emptyLabel={
                      isFetchingRegions ? "Lade Daten.." : "Keine Ergebnisse."
                    }
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
