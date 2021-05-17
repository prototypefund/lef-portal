import { ResultEntry } from "./resultPageComponents/ResultEntry";
import { Heading } from "./shared/Heading";
import { Button } from "react-bootstrap";
import { TargetWidget } from "./shared/TargetWidget";
import { useEffect, useState } from "react";
import {
  requestGetAllObjectivesForRegion,
  requestGetRegion,
} from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AddObjectivesAndActionsDialog } from "./resultPageComponents/AddObjectivesAndActionsDialog";
import { ArrowLeftCircleFill } from "react-bootstrap-icons";
import { PRIMARY_COLOR } from "../assets/colors";

const resultEntries = [
  {
    id: 1,
    question:
      "Welche Meilensteine hat %s schon erreicht?\nWelche Ziele hat sich %s für die Zukunft gesetzt?",
  },
];

export const ResultPage = ({ regionId, onBack = () => {} }) => {
  const dispatch = useDispatch();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isActionMode, setIsActionMode] = useState(false);
  const [editedObjective, setEditedObjective] = useState({});
  const [editedAction, setEditedAction] = useState({});
  const objectiveData = useSelector((state) => state.data.objectiveData);

  useEffect(() => {
    dispatch(requestGetRegion(regionId));
    dispatch(requestGetAllObjectivesForRegion(regionId));
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
            <ArrowLeftCircleFill size={25} color={PRIMARY_COLOR} />
          </Button>
        </div>
        <div className={"flex-grow-1"}>
          <Heading size={"h4"} text={`Dein Klimacheck für: ${name}`} />
        </div>
      </div>

      <div className={"d-flex flex-column w-100"}>
        {resultEntries.map((entry) => (
          <ResultEntry
            key={entry.id}
            question={entry.question.replaceAll("%s", name)}
          />
        ))}
      </div>

      <TargetWidget
        onActionAdd={(id) => {
          setIsActionMode(true);
          setEditedObjective(objectiveData[id]);
          setShowAddDialog(true);
        }}
        city={name}
        regionData={regionData}
        onEdit={(id) => {
          setIsActionMode(false);
          setEditedObjective(objectiveData[id]);
          setShowAddDialog(true);
        }}
      />
      <Button
        onClick={() => {
          setIsActionMode(false);
          setEditedObjective({});
          setShowAddDialog(true);
        }}
      >
        Ziel hinzufügen
      </Button>
      {showAddDialog && (
        <AddObjectivesAndActionsDialog
          isAction={isActionMode}
          editedObjective={editedObjective}
          regionData={regionData}
          show={showAddDialog}
          onClose={() => {
            setShowAddDialog(false);
            setIsActionMode(false);
          }}
        />
      )}
    </div>
  );
};
