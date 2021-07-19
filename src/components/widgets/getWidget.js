import { ObjectivesWidget } from "./ObjectivesWidget";
import { ClimateWidget } from "./ClimateWidget";
import { VotingWidget } from "./VotingWidget";
// import { CarsWidget } from "./CarsWidget";
// import { WarmingStripeWidget } from "./WarmingStripeWidget";

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
  },
  3: {
    name: "Wahlverhalten",
    question:
      "Hat sich das Verhalten und die Einstellung der Bürger:innen in %s mit Hinblick auf den Klimaschutz in den letzten Jahren verändert?",
    component: VotingWidget,
    flag: "votingWidget",
  },
  /*4: {
    name: "PKW-Zulassungen",
    question:
      "Hat sich die Anzahl neu zugelassener PKW in %s in den letzten Jahren verändert?",
    component: CarsWidget,
  },
  5: {
    name: "Warming Stripes",
    question: "Wie haben sich die Durchschnittstemperaturen in %s verändert?",
    component: WarmingStripeWidget,
  },*/
};
