import { ObjectivesWidget } from "./ObjectivesWidget";
import { ClimateWidget } from "./ClimateWidget";
import { VotingWidget } from "./VotingWidget";
import { CarsWidget } from "./CarsWidget";
import { WarmingStripeWidget } from "./WarmingStripeWidget";

export const WIDGETS = {
  1: {
    question:
      "Welche Meilensteine hat %s schon erreicht?\nWelche Ziele hat sich %s für die Zukunft gesetzt?",
    component: ObjectivesWidget,
  },
  2: {
    question: "Hat sich das Wetter in %s in den letzten Jahrzehnten verändert?",
    component: ClimateWidget,
  },
  3: {
    question:
      "Hat sich das Verhalten und die Einstellung der Bürger:innen in %s mit Hinblick auf den Klimaschutz in den letzten Jahren verändert?",
    component: VotingWidget,
  },
  4: {
    question:
      "Hat sich die Anzahl neu zugelassener PKW in %s in den letzten Jahren verändert?",
    component: CarsWidget,
  },
  5: {
    question: "Wie haben sich die Durchschnittstemperaturen verändert?",
    component: WarmingStripeWidget,
  },
};
