import { Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import {
  requestCreateActionForRegion,
  requestCreateObjectiveForRegion,
  requestUpdateAction,
  requestUpdateObjective,
} from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { LefModal } from "../shared/LefModal";
import MultiSelect from "react-multi-select-component";

export const getYYYYMMDD = (date) => {
  const dateObj = new Date(date);
  const mm = dateObj.getMonth() + 1;
  const dd = dateObj.getDate();

  return [
    dateObj.getFullYear(),
    (mm > 9 ? "" : "0") + mm,
    (dd > 9 ? "" : "0") + dd,
  ].join("-");
};

export const AddObjectivesAndActionsDialog = ({
  regionData,
  editedObjective = {},
  show,
  onClose,
  isAction,
}) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(editedObjective.title || "Test");
  const [budget, setBudget] = useState(editedObjective.title || "0");
  const [startDate, setStartDate] = useState(
    editedObjective.startDate
      ? getYYYYMMDD(editedObjective.startDate)
      : "01.01.2020"
  );
  const [endDate, setEndDate] = useState(
    editedObjective.endDate
      ? getYYYYMMDD(editedObjective.endDate)
      : "01.01.2030"
  );
  const [description, setDescription] = useState(
    editedObjective.description || "Test Beschreibung"
  );
  const [tags, setTags] = useState(
    editedObjective.tags ? editedObjective.tags.join(" ") : "Test"
  );
  const [objectiveIds, setObjectiveIds] = useState(
    editedObjective.objectiveIds
      ? editedObjective.objectiveIds.join(" ")
      : "6095ab9dd25491398032b409"
  );

  const regionsActions = useSelector((state) =>
    state.data.actionsForRegion[regionData._id]
      ? state.data.actionsForRegion[regionData._id]
      : []
  );

  console.debug(regionsActions);

  const [actionIds, setActionIds] = useState([]);
  const editMode = Boolean(!isAction && editedObjective._id);

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

  const filteredActions = regionsActions.filter(
    (a) =>
      Array.isArray(a.objectiveIds) &&
      a.objectiveIds.includes(editedObjective._id)
  );

  useEffect(() => {
    setActionIds(filteredActions);
  }, [editedObjective._id]);

  const size = "md";
  let optionsMapping = (a) => ({
    label: a.description,
    value: a._id,
  });
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
            rows={3}
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
        {!isAction && (
          <Row>
            <Col md={12} lg={6}>
              <Form.Group controlId={"objectives"}>
                <Form.Label>{"Zugeordnete Maßnahmen"}</Form.Label>
                <MultiSelect
                  options={regionsActions.map(optionsMapping)}
                  value={actionIds.map(optionsMapping)}
                  onChange={(selected) =>
                    setActionIds(
                      regionsActions.filter((a) => selected.includes(a._id))
                    )
                  }
                  labelledBy="actions"
                  placeholder={"Keine Maßnahmen zugeordnet"}
                  selectDeselectLabel={"Alle/Keine auswählen"}
                  hasSelectAll={false}
                  overrideStrings={{
                    allItemsAreSelected: "(alle ausgewählt)",
                    clearSearch: "",
                    noOptions: "Keine Maßnahmen vorhanden",
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
  const objectiveIdsArray =
    objectiveIds && objectiveIds !== "" ? objectiveIds.split(" ") : [];
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
          label: editMode ? "Änderung speichern" : "Hinzufügen",
          onClick: () => {
            dispatch(
              isAction
                ? editMode
                  ? requestUpdateAction()
                  : requestCreateActionForRegion(
                      startDate,
                      endDate,
                      title,
                      description,
                      budget,
                      tags,
                      regionData._id,
                      [editedObjective._id]
                    )
                : editMode
                ? requestUpdateObjective({
                    ...editedObjective,
                    startDate,
                    endDate,
                    title,
                    description,
                    tags: tagsArray,
                    actions: actionIds,
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
            closeDialog();
          },
          disabled: tagsArray.length === 0,
        },
      ]}
    />
  );
};
