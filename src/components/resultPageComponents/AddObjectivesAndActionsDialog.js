import { Button, Col, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { requestCreateObjectiveForRegion } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { LefModal } from "../shared/LefModal";

export const AddObjectivesAndActionsDialog = ({
  regionData,
  show,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const size = "md";
  let content = (
    <div>
      <Form>
        <Row>
          <Col md={12} lg={6}>
            <Form.Group controlId={"addObjectiveName"}>
              <Form.Label>Name</Form.Label>
              <Form.Control
                size={size}
                onChange={(e) => setTitle(e.target.value)}
                type={"title"}
                placeholder={"Name des Ziels"}
                value={title}
              />
            </Form.Group>
          </Col>
          <Col md={12} lg={6}>
            <Form.Group controlId={"addObjectiveTags"}>
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
        <Form.Group controlId={"addObjectiveDescription"}>
          <Form.Label>Beschreibung</Form.Label>
          <Form.Control
            size={size}
            as={"textarea"}
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
            type={"textarea"}
            placeholder={"Kurze Beschreibung des Ziels"}
            value={description}
          />
        </Form.Group>

        <Row>
          <Col md={12} lg={6}>
            <Form.Group controlId={"addObjectiveStartDate"}>
              <Form.Label>Beginn / Datum der Zielsetzung</Form.Label>
              <Form.Control
                size={size}
                onChange={(e) => setStartDate(e.target.value)}
                type={"date"}
                value={startDate}
              />
            </Form.Group>
          </Col>

          <Col md={12} lg={6}>
            <Form.Group controlId={"addObjectiveEndDate"}>
              <Form.Label>Angepeiltes Datum der Zielerreichung</Form.Label>
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
      title={`Ziel für ${regionData.name} hinzufügen`}
      buttons={[
        {
          label: "Abbrechen",
          variant: "secondary",
          onClick: onClose,
        },
        {
          label: "Hinzufügen",
          onClick: () => {
            dispatch(
              requestCreateObjectiveForRegion(
                startDate,
                endDate,
                title,
                description,
                tags,
                [],
                regionData
              )
            );
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
