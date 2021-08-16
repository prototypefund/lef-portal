import { ObjectivesWidget } from "./ObjectivesWidget";
import { ClimateWidget } from "./ClimateWidget";
import { VotingWidget } from "./VotingWidget";
import { WarmingStripeWidget } from "./WarmingStripeWidget";

export const WIDGETS = {
  1: {
    name: "Ziele & Maßnahmen",
    question:
      "Welche Meilensteine hat %s schon erreicht?\nWelche Ziele hat sich %s für die Zukunft gesetzt?",
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
    question:
      "Wie hat sich die Temperatur in %s seit 1990 im Vergleich zur Durchschnittstemperatur der Jahre 1961 bis 1990 verändert?",
    component: WarmingStripeWidget,
    flag: "warmingstripeWidget",
    sources: ["Deutscher Wetterdienst"],
  },
  4: {
    name: "Wahlverhalten",
    question:
      "Hat sich das Wahlverhalten der Bürger:innen in %s, ggf. mit Hinblick auf das Thema Klimaschutz, in den letzten Jahren verändert?",
    component: VotingWidget,
    flag: "votingWidget",
    sources: [
      "https://www.wahlergebnisse.nrw/kommunalwahlen/",
      "http://www.landesdatenbank.nrw.de/",
    ],
  },
};
