import { useState } from "react";
import MapChart from "./MapChart";
import { Heading } from "./shared/Heading";
import { Typeahead } from "react-bootstrap-typeahead";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { requestCreateRegion } from "../redux/dataSlice";

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
  const regions = useSelector((state) => state.data.regionData);
  const [coords, setCoords] = useState({});
  const { longitude, latitude } = coords;
  const dispatch = useDispatch();

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
    <div className={"col alert alert-secondary"}>
      <Heading size={"h4"} text={'Was ist "Dein Klimacheck"?'} />
      <p style={{ whiteSpace: "pre-wrap" }} className={"mt-2"}>
        {
          "Über den Klimaschutz wird viel geredet - aber du fragst dich, was sich ganz konkret vor deiner Haustür tut? Was unternehmen deine Kommune, dein Kreis und die Unternehmen in deiner Region in Sachen Klima? Sind die Folgen des Klimawandels bereits bei dir zu spüren?\n\nWir erklären dir kurz und bündig, was bisher schon an Klimaschutzmaßnahmen passiert ist, wo wir gerade stehen und was in Zukunft noch geplant ist."
        }
      </p>
    </div>
  );
  return (
    <div className={"col"}>
      {/*<Button
          onClick={() =>
            dispatch(
              requestCreateRegion("Münster", [ 48167, ])
            )
          }
        >
          Neue Region
        </Button>*/}
      <Row className={"mb-3"}>
        <div className={"col"}>
          <Heading text={"Dein Klimacheck"} size={"h1"} />
        </div>
      </Row>
      <div
        // fluid={"sm"}
        className={"d-flex align-items-center justify-content-center m-0 p-0"}
        // style={{ height: 600 }}
      >
        <Row xs={12} className={"w-100 "}>
          <Col
            xs={12}
            md={6}
            className={
              "d-flex align-items-center justify-content-center flex-column p-0"
            }
          >
            <Row xs={12} className={"mt-5"}>
              <Heading
                size={"h2"}
                text={"Wie läuft der Klimaschutz in/bei .."}
              />
            </Row>
            <Col>
              <Row className={"w-100"}>
                <Typeahead
                  style={{ width: "100%" }}
                  id={"citySelection"}
                  onChange={(values) => onCitySelect(values[0].value)}
                  placeholder={"Stadt / Unternehmen"}
                  options={getTypeAheadOptions(regions)}
                  emptyLabel={"Keine Ergebnisse."}
                />
              </Row>
              <Row>
                <Button
                  className={"mt-1"}
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
            xs={12}
            md={6}
            // style={{ minHeight: 600 }}
          >
            <MapChart
              lat={latitude}
              lon={longitude}
              regions={regions}
              onRegionClick={(regionId) => onCitySelect(regionId)}
            />
          </Col>
        </Row>
      </div>

      <Row className={"mt-4"}></Row>
    </div>
  );
};
