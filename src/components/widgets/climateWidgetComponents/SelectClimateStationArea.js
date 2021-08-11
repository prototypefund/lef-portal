import { LefModal } from "../../shared/LefModal";
import MapChart from "../../MapChart";
import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { LefSelect } from "../../shared/LefSelect";
import { isArray } from "chart.js/helpers";
import {
  useGetAllClimateStationsQuery,
  useUpdateRegionMutation,
} from "../../../redux/lefReduxApi";
import { SpinnerWrapper } from "../../shared/SpinnerWrapper";

export const SelectClimateStationArea = ({ regionData = {} }) => {
  const [showMapModal, setShowMapModal] = useState(false);
  const [updateRegion] = useUpdateRegionMutation();

  const {
    data: allWeatherStations = {},
    isFetching: isFetchingClimateStations,
  } = useGetAllClimateStationsQuery();

  let sortedWeatherStationsArray = Object.keys(allWeatherStations)
    .map((key) => allWeatherStations[key])
    .sort((a, b) => (a.weatherStationName < b.weatherStationName ? -1 : 1));

  const selectWeatherStationTypeahead = (
    <LefSelect
      style={{ width: "100%" }}
      isLoading={allWeatherStations.length === 0}
      id={"weatherStationSelect"}
      onChange={(values) =>
        isArray(values) &&
        values.length > 0 &&
        updateRegion({
          ...regionData,
          weatherStations: [values[0].value],
        })
      }
      placeholder={"Name der Wetterstation"}
      options={sortedWeatherStationsArray.map((weatherStation) => ({
        label: weatherStation.weatherStationName,
        value: weatherStation._id,
      }))}
    />
  );

  const SelectWeatherStation = (
    <>
      <Row className={"align-items-baseline"}>
        <Col sm={4}>
          <p>Wetterstation auswählen:</p>
        </Col>
        <Col sm={8}>
          <Row>{selectWeatherStationTypeahead}</Row>
          <Row className={"justify-content-end mt-2"}>
            <Button onClick={() => setShowMapModal(true)} size={"sm"}>
              auf Karte auswählen
            </Button>
          </Row>
        </Col>
      </Row>
    </>
  );

  const SelectWeatherStationMapModal = (
    <LefModal
      title={"Wetterstation auswählen"}
      buttons={[{ label: "Abbrechen", onClick: () => setShowMapModal(false) }]}
      show={showMapModal}
      content={
        <>
          <p>
            {
              "Tippen Sie die Wetterstation an, deren Daten Sie übernehmen wollen. Sie können per Mausrad in die Karte hereinzoomen."
            }
          </p>
          <MapChart
            regions={[regionData]}
            dots={sortedWeatherStationsArray.map((ws) => ({
              ...ws,
              lon: ws.longitude,
              lat: ws.latitude,
              description: ws.weatherStationName,
              size: 2,
              id: ws._id,
              onClick: () => {
                setShowMapModal(false);
                updateRegion({
                  ...regionData,
                  weatherStations: [ws._id],
                });
              },
            }))}
          />
        </>
      }
    />
  );

  return (
    <>
      <SpinnerWrapper
        loading={isFetchingClimateStations}
        spinnerProps={{ hideBackground: true }}
      >
        {SelectWeatherStation}
      </SpinnerWrapper>
      {SelectWeatherStationMapModal}
    </>
  );
};
