import { ResultEntry } from "./resultPageComponents/ResultEntry";
import { Heading } from "./shared/Heading";
import { Button } from "react-bootstrap";

const resultEntries = [
  {
    question:
      "Welche Meilensteine hat %s schon erreicht?\nWelche Ziele hat sich %s für die Zukunft gesetzt?",
  },
];

export const ResultPage = ({ city = "", onBack = () => {} }) => (
  <div>
    <div className={"d-flex align-items-center mb-1"}>
      <div className={"flex-grow-0"}>
        <Button variant={"link"} className={"mr-1"} onClick={onBack}>
          {"<"}
        </Button>
      </div>
      <div className={"flex-grow-1"}>
        <Heading size={"h4"} text={`Dein Klimacheck für: ${city}`} />
      </div>
    </div>

    <div className={"d-flex flex-column w-100"}>
      {resultEntries.map((entry) => (
        <ResultEntry question={entry.question.replaceAll("%s", city)} />
      ))}
    </div>
  </div>
);
