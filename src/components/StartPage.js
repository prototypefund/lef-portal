import { useState } from "react";
import MapChart from "./MapChart";
import { Heading } from "./shared/Heading";
import { Typeahead } from "react-bootstrap-typeahead";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { requestCreateRegion } from "../redux/dataSlice";

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

  let sortedRegions = [...regions];
  return (
    <div className={"col"}>
      <div className={"row"}>
        <div className={"col"}>
          <Heading text={"Dein Klimacheck"} level={1} />
        </div>
      </div>
      <div className={"row"}>
        <div className={"col-md col-lg-3 mb-2 mb-0-md"}>
          <Heading size={"h4"} text={"Wie läuft der Klimaschutz in/bei .."} />
        </div>
        <div className={"col-md col-lg-3 mb-2 mb-0-md"}>
          <Typeahead
            id={"citySelection"}
            onChange={(values) => onCitySelect(values[0].value)}
            placeholder={"Stadt / Unternehmen"}
            options={sortedRegions
              .sort((a, b) => (a.name < b.name ? -1 : 1))
              .map((region) => ({
                label: region.name,
                value: region._id,
              }))}
            emptyLabel={"Keine Ergebnisse."}
          />

          <Button
            className={"mt-1"}
            size={"sm"}
            variant={"primary"}
            onClick={() => getLocation()}
          >
            Meinen Standort verwenden
          </Button>
        </div>
        {/*<Button
          onClick={() =>
            dispatch(
              requestCreateRegion("Dülmen", [
                59399,
              ])
            )
          }
        >
          Neue Region
        </Button>
        */}
        <div className={"col-lg"}>
          <MapChart lat={latitude} lon={longitude} />
        </div>
      </div>
    </div>
  );
};
