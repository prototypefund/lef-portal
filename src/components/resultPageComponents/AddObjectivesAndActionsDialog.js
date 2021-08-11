import { Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LefModal } from "../shared/LefModal";
import MultiSelect from "react-multi-select-component";
import {
  requestCreateActionForRegion,
  requestCreateObjectiveForRegion,
  requestUpdateAction,
  requestUpdateObjective,
} from "../../redux/dataSlice";
import { usePrevious } from "../../hooks/usePrevious";
import { getYYYYMMDD } from "../../utils/utils";

const optionsMapping = (objective) => ({
  label: objective.title,
  value: objective._id,
});

export const AddObjectivesAndActionsDialog = ({
  regionData,
  editedObjective = {},
  show,
  onClose,
  isAction,
  editedAction = {},
}) => {
  const dispatch = useDispatch();

  const regionsObjectives = useSelector(
    (state) => state.data.objectivesForRegion[regionData._id] || []
  );

  const isUpdatingObjective = useSelector(
    (state) => state.data.isUpdatingObjective
  );

  const previousIsUpdatingObjective = usePrevious(isUpdatingObjective);

  const sourceObject = isAction ? editedAction : editedObjective || {};
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(sourceObject.title || "");
  const [budget, setBudget] = useState(sourceObject.budget || "0");
  const [startDate, setStartDate] = useState(
    sourceObject.startDate ? getYYYYMMDD(sourceObject.startDate) : "01.01.2020"
  );
  const [endDate, setEndDate] = useState(
    sourceObject.endDate ? getYYYYMMDD(sourceObject.endDate) : "01.01.2030"
  );
  const [description, setDescription] = useState(
    sourceObject.description || ""
  );
  const [tags, setTags] = useState(
    sourceObject.tags ? sourceObject.tags.join(" ") : ""
  );
  const [selectedObjectives, setSelectedObjectives] = useState(
    sourceObject.objectiveIds
      ? sourceObject.objectiveIds
          .map((id) => regionsObjectives.find((o) => o._id === id))
          .map(optionsMapping)
      : []
  );

  const editMode = Boolean(sourceObject._id);

  const resetValues = () => {
    setDescription("");
    setTitle("");
    setTags("");
    setStartDate("");
    setEndDate("");
    setBudget(0);
  };

  const closeDialog = () => {
    resetValues();
    onClose();
  };

  // TODO react to other actions (createObjective, createAction, updateAction)
  useEffect(() => {
    if (previousIsUpdatingObjective && !isUpdatingObjective && isSaving) {
      closeDialog();
      setIsSaving(false);
    }
  }, [isSaving, isUpdatingObjective, previousIsUpdatingObjective]);

  const size = "md";
  let content = (
    <div>
      <Form>
        <Row>
          <Col md={12} lg={6}>
            <Form.Group controlId={isAction ? "actionName" : "objectiveName"}>
              <Form.Label>Name</Form.Label>
              <Form.Control
                size={size}
                onChange={(e) => setTitle(e.target.value)}
                type={"title"}
                placeholder={isAction ? "Name der Maßnahme" : "Name des Ziels"}
                value={title}
              />
            </Form.Group>
          </Col>
          <Col md={12} lg={6}>
            <Form.Group controlId={"objectiveTags"}>
              <Form.Label>Stichwörter</Form.Label>
              <Form.Control
                size={size}
                onChange={(e) => setTags(e.target.value)}
                type={"tags"}
                value={tags}
                placeholder={
                  "Stichwörter (durch Leerzeichen getrennt) eingeben"
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId={"objectiveDescription"}>
          <Form.Label>Beschreibung</Form.Label>
          <Form.Control
            size={size}
            as={"textarea"}
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
            type={"textarea"}
            placeholder={
              isAction
                ? "Kurze Beschreibung der Maßnahme"
                : "Kurze Beschreibung des Ziels"
            }
            value={description}
          />
        </Form.Group>

        <Row>
          <Col md={12} lg={6}>
            <Form.Group controlId={"objectiveStartDate"}>
              <Form.Label>
                {isAction
                  ? "Beginn der Maßnahme"
                  : "Beginn / Datum der Zielsetzung"}
              </Form.Label>
              <Form.Control
                size={size}
                onChange={(e) => setStartDate(e.target.value)}
                type={"date"}
                value={startDate}
              />
            </Form.Group>
          </Col>

          <Col md={12} lg={6}>
            <Form.Group controlId={"objectiveEndDate"}>
              <Form.Label>
                {isAction
                  ? "Ende der Maßnahme"
                  : "Angepeiltes Datum der Zielerreichung"}
              </Form.Label>
              <Form.Control
                size={size}
                onChange={(e) => setEndDate(e.target.value)}
                type={"date"}
                value={endDate}
              />
            </Form.Group>
          </Col>
        </Row>

        {isAction && (
          <Row>
            <Col md={12} lg={6}>
              <Form.Group controlId={"budget"}>
                <Form.Label>{"Budget"}</Form.Label>
                <Form.Control
                  size={size}
                  onChange={(e) => setBudget(e.target.value)}
                  type={"number"}
                  value={budget}
                />
              </Form.Group>
            </Col>
          </Row>
        )}
        {isAction && (
          <Row>
            <Col md={12} lg={6}>
              <Form.Group controlId={"objectives"}>
                <Form.Label>{"Zugeordnete Ziele"}</Form.Label>
                <MultiSelect
                  options={regionsObjectives.map(optionsMapping)}
                  value={selectedObjectives}
                  onChange={setSelectedObjectives}
                  labelledBy="actions"
                  placeholder={"Keine Ziele zugeordnet"}
                  selectDeselectLabel={"Alle/Keine auswählen"}
                  hasSelectAll={false}
                  overrideStrings={{
                    allItemsAreSelected: "(alle ausgewählt)",
                    clearSearch: "",
                    noOptions: "Keine Ziele vorhanden",
                    search: "Suche",
                    selectAll: "Alle auswählen",
                    selectSomeItems: "Auswählen..",
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
        )}
      </Form>
    </div>
  );
  const tagsArray = tags && tags !== "" ? tags.split(" ") : [];
  return (
    <LefModal
      size={"lg"}
      content={content}
      show={show}
      title={`${isAction ? "Maßnahme" : "Ziel"} ${
        editMode ? "bearbeiten" : "hinzufügen"
      }`}
      buttons={[
        {
          label: "Abbrechen",
          variant: "secondary",
          onClick: closeDialog,
        },
        {
          loading: isSaving,
          label: editMode ? "Änderung speichern" : "Hinzufügen",
          onClick: () => {
            dispatch(
              isAction
                ? editMode
                  ? requestUpdateAction({
                      ...editedAction,
                      startDate,
                      endDate,
                      title,
                      description,
                      tags: tagsArray,
                      budget,
                      objectiveIds: selectedObjectives.map((o) => o.value),
                    })
                  : requestCreateActionForRegion(
                      startDate,
                      endDate,
                      title,
                      description,
                      budget,
                      tags,
                      regionData._id,
                      selectedObjectives.map((o) => o.value)
                    )
                : editMode
                ? requestUpdateObjective({
                    ...editedObjective,
                    startDate,
                    endDate,
                    title,
                    description,
                    tags: tagsArray,
                  })
                : requestCreateObjectiveForRegion(
                    startDate,
                    endDate,
                    title,
                    description,
                    tagsArray,
                    regionData._id
                  )
            );
            setIsSaving(true);
          },
          disabled: tagsArray.length === 0,
        },
      ]}
    />
  );
};
