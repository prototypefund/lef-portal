import { ObjectivesWidget } from "./ObjectivesWidget";
import { WeatherWidget } from "./WeatherWidget";
import { AttitudeWidget } from "./AttitudeWidget";
import React from "react";
import { CarsWidget } from "./CarsWidget";

const WIDGETS = (regionData, editMode) => ({
  1: {
    question:
      "Welche Meilensteine hat %s schon erreicht?\nWelche Ziele hat sich %s für die Zukunft gesetzt?",
    component: <ObjectivesWidget regionData={regionData} editMode={editMode} />,
  },
  2: {
    question: "Hat sich das Wetter in %s in den letzten Jahrzehnten verändert?",
    component: <WeatherWidget regionData={regionData} />,
  },
  3: {
    question:
      "Hat sich das Verhalten und die Einstellung der Bürger:innen in %s mit Hinblick auf den Klimaschutz in den letzten Jahren verändert?",
    component: <AttitudeWidget regionData={regionData} />,
  },
  4: {
    question:
      "Hat sich die Anzahl zugelassener PKW in %s in den letzten Jahren verändert?",
    component: <CarsWidget regionData={regionData} />,
  },
});

export const getWidget = (id, regionData, editMode) => {
  return WIDGETS(regionData, editMode)[id];
};
