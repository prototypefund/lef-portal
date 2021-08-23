import { LefModal } from "../../shared/LefModal";
import MapChart from "../../MapChart";
import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { LefSelect } from "../../shared/LefSelect";
import {
  useGetAllClimateStationsQuery,
  useUpdateRegionMutation,
} from "../../../redux/lefReduxApi";
import { SpinnerWrapper } from "../../shared/SpinnerWrapper";
import { isArrayWithOneElement } from "../../../utils/utils";

export const SelectClimateStationArea = ({ regionData = {} }) => {
  const { weatherStations = [] } = regionData;
  const [showMapModal, setShowMapModal] = useState(false);
  const [updateRegion] = useUpdateRegionMutation();
  const {
    data: allWeatherStations = {},
    isFetching: isFetchingClimateStations,
  } = useGetAllClimateStationsQuery();

  const weatherStationsToOptions = (weatherStation) => ({
    label: weatherStation.weatherStationName,
    value: weatherStation._id,
  });
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!isFetchingClimateStations && isArrayWithOneElement(weatherStations)) {
      setSelected(
        sortedWeatherStationsArray
          .filter((s) => weatherStations.includes(s._id))
          .map(weatherStationsToOptions)
      );
    }
  }, [isFetchingClimateStations, weatherStations]);
  let sortedWeatherStationsArray = Object.keys(allWeatherStations)
    .map((key) => allWeatherStations[key])
    .sort((a, b) => (a.weatherStationName < b.weatherStationName ? -1 : 1));

  const selectWeatherStationTypeahead = (
    <LefSelect
      selected={selected}
      multiple
      style={{ width: "100%" }}
      isLoading={allWeatherStations.length === 0}
      id={"weatherStationSelect"}
      onChange={(values) => {
        if (isArrayWithOneElement(values))
          updateRegion({
            ...regionData,
            weatherStations: values.map((v) => v.value),
          });
        setSelected(values);
      }}
      placeholder={"Name der Wetterstation"}
      options={sortedWeatherStationsArray.map(weatherStationsToOptions)}
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
      <Row>
        <p className={"small mt-2 mb-2 ml-3"}>
          Sie können bis zu zwei Wetterstationen auswählen. Daten aus mehreren
          Wetterstationen werden gemittelt.
        </p>
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
