import { ResultEntry } from "./resultPageComponents/ResultEntry";
import { Heading } from "./shared/Heading";
import { Button, Modal } from "react-bootstrap";
import { TargetWidget } from "./shared/TargetWidget";
import { useEffect, useState } from "react";
import { requestGetRegion } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AddObjectivesAndActionsDialog } from "./resultPageComponents/AddObjectivesAndActionsDialog";
import { LefModal } from "./shared/LefModal";

const resultEntries = [
  {
    question:
      "Welche Meilensteine hat %s schon erreicht?\nWelche Ziele hat sich %s für die Zukunft gesetzt?",
  },
];

export const ResultPage = ({ regionId, onBack = () => {} }) => {
  const dispatch = useDispatch();
  const [showAddDialog, setShowAddDialog] = useState(false);
  useEffect(() => {
    dispatch(requestGetRegion(regionId));
  }, []);

  const regionData =
    useSelector((state) => state.data.regionData[regionId]) || {};
  const { name } = regionData;
  return (
    <div>
      {/*<Button onClick={() => dispatch(requestCreateRegion())}>
        Neue Region
      </Button>*/}
      <div className={"d-flex align-items-center mb-1"}>
        <div className={"flex-grow-0"}>
          <Button variant={"link"} className={"mr-1"} onClick={onBack}>
            {"<"}
          </Button>
        </div>
        <div className={"flex-grow-1"}>
          <Heading size={"h4"} text={`Dein Klimacheck für: ${name}`} />
        </div>
      </div>

      <div className={"d-flex flex-column w-100"}>
        {resultEntries.map((entry) => (
          <ResultEntry question={entry.question.replaceAll("%s", name)} />
        ))}
      </div>

      <TargetWidget city={name} regionData={regionData} />
      <Button onClick={() => setShowAddDialog(true)}>Ziel hinzufügen</Button>
      <AddObjectivesAndActionsDialog
        regionData={regionData}
        show={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </div>
  );
};
