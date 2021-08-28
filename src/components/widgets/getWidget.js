import { ObjectivesWidget } from "./ObjectivesWidget";
import { ClimateWidget } from "./ClimateWidget";
import { VotingWidget } from "./VotingWidget";
import { WarmingStripeWidget } from "./WarmingStripeWidget";

export const WIDGETS = {
  1: {
    name: "Ziele & Maßnahmen",
    question: "Welche Ziele hat sich %s für die Zukunft gesetzt?",
    component: ObjectivesWidget,
    flag: "objectiveWidget",
  },
  2: {
    name: "Temperaturen",
    question: "Hat sich das Wetter in %s in den letzten Jahrzehnten verändert?",
    component: ClimateWidget,
    flag: "climateWidget",
    sources: ["Deutscher Wetterdienst"],
  },
  3: {
    name: "Warming Stripes",
    question: "Wie hat sich die Durchschnittstemperatur in %s verändert?",
    component: WarmingStripeWidget,
    flag: "warmingstripeWidget",
    sources: ["Deutscher Wetterdienst"],
  },
  4: {
    name: "Wahlverhalten",
    question: "Welche Parteien hat %s bei Kommunalwahlen gewählt?",
    component: VotingWidget,
    flag: "votingWidget",
    sources: [
      "https://www.wahlergebnisse.nrw/kommunalwahlen/",
      "http://www.landesdatenbank.nrw.de/",
    ],
  },
};
