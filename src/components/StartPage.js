import { useEffect, useState } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import MapChart from "./MapChart";
import { Heading } from "./shared/Heading";
import { Typeahead } from "react-bootstrap-typeahead";
import { Button } from "react-bootstrap";

const regions = [
  {
    label: "Münster",
    id: "609454a56242d72210a4fefc",
  },
  {
    label: "Dresden",
    id: "6094567e6242d72210a4fefd",
  },
];

export const StartPage = ({ onCitySelect = () => {} }) => {
  const [searchWord, setSearchword] = useState("");
  const [coords, setCoords] = useState({});
  const { longitude, latitude } = coords;

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSearchword(
          position.coords.latitude + "/" + position.coords.longitude
        );
        setCoords(position.coords);
      },
      () => console.debug("Location not available!")
    );
  };

  useEffect(() => {}, []);

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
              label: region.label,
              value: region.id,
            }))}
            emptyLabel={"Keine Ergebnisse."}
          />
          <Button
            className={"mt-1"}
            size={"sm"}
            variant={"link"}
            onClick={() => getLocation()}
          >
            Meinen Standort verwenden
          </Button>
        </div>
        <div className={"col-lg"}>
          <MapChart lat={latitude} lon={longitude} />
        </div>
      </div>
    </div>
  );
};
