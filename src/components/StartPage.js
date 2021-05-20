import { useEffect, useState } from "react";
import MapChart from "./MapChart";
import { Heading } from "./shared/Heading";
import { Typeahead } from "react-bootstrap-typeahead";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { requestCreateRegion, requestGetAllRegions } from "../redux/authSlice";

export const StartPage = ({ onCitySelect = () => {} }) => {
  const regions = useSelector((state) => state.data.regionData);
  const dispatch = useDispatch();
  const [coords, setCoords] = useState({});
  const { longitude, latitude } = coords;

  useEffect(() => {}, []);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setCoords(position.coords);
        // TODO find region closest to user location
      },
      () => alert("Dein Standort konnte leider nicht ermittelt werden!")
    );
  };

  useEffect(() => {
    dispatch(requestGetAllRegions());
  }, []);

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
            options={regions.map((region) => ({
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
            dispatch(requestCreateRegion("Münster", [48153, 48154]))
          }
        >
          Neue Region
        </Button>*/}
        <div className={"col-lg"}>
          <MapChart lat={latitude} lon={longitude} />
        </div>
      </div>
    </div>
  );
};
