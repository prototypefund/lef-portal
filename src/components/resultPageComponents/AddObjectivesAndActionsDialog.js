import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import {
  requestCreateAction,
  requestCreateObjectiveForRegion,
  requestUpdateAction,
  requestUpdateObjective,
} from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { LefModal } from "../shared/LefModal";

const getYYYYMMDD = (date) => {
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
  const [title, setTitle] = useState(editedObjective.title || "");
  const [startDate, setStartDate] = useState(
    editedObjective.startDate ? getYYYYMMDD(editedObjective.startDate) : ""
  );
  const [endDate, setEndDate] = useState(
    editedObjective.endDate ? getYYYYMMDD(editedObjective.endDate) : ""
  );
  const [description, setDescription] = useState(
    editedObjective.description || ""
  );
  const [tags, setTags] = useState(
    editedObjective.tags ? editedObjective.tags.join(" ") : ""
  );
  const editMode = Boolean(editedObjective._id);

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
      </Form>
    </div>
  );
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
          onClick: onClose,
        },
        {
          label: editMode ? "Änderung speichern" : "Hinzufügen",
          onClick: () => {
            const tagsArray = tags && tags !== "" ? tags.split(" ") : [];
            dispatch(
              isAction
                ? editMode
                  ? requestUpdateAction()
                  : requestCreateAction(
                      startDate,
                      endDate,
                      title,
                      description,
                      "budget",
                      tags
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
                    [],
                    regionData
                  )
            );
            onClose();
            setDescription("");
            setTitle("");
            setTags("");
            setStartDate("");
            setEndDate("");
          },
        },
      ]}
    />
  );
};
