import { Accordion, Card, Col, Row } from "react-bootstrap";
import { EditButton } from "../../shared/EditButton";
import React from "react";
import * as PropTypes from "prop-types";
import { DeleteButton } from "../../shared/DeleteButton";
import { GermanDateString } from "../../shared/GermanDateString";

export const ActionDisplay = ({
  action = {},
  editMode,
  onEditAction,
  onDeleteAction,
}) => {
  let badgeStyle = {
    padding: 0,
    marginBottom: 5,
    fontSize: 11,
    whiteSpace: "no-wrap",
    width: "100%",
  };

  const { description, startDate, endDate, budget, _id, title } = action;
  return (
    <div className={"mb-2"} style={{ cursor: "pointer" }}>
      <Card>
        <Accordion.Toggle
          as={"div"}
          variant="link"
          eventKey={_id}
          className={"w-100"}
        >
          <Card.Header className={"w-100"}>
            <Row className={"text-left align-items-baseline"}>
              <Col xs={12} sm={4}>
                <div style={{ ...badgeStyle }} className={"d-flex"}>
                  <GermanDateString date={startDate} />
                  <span style={{ whiteSpace: "pre" }}>{" bis "}</span>
                  <GermanDateString date={endDate} />
                </div>
              </Col>
              <Col xs={12} sm={8}>
                {title || "Maßnahme"}
              </Col>
            </Row>
          </Card.Header>
        </Accordion.Toggle>

        <Accordion.Collapse eventKey={_id}>
          <Card.Body>
            <Row xs={12} className={"w-100"}>
              <Col
                xs={editMode ? 11 : 12}
                sm={editMode ? 11 : 12}
                className={"text-left w-100"}
              >
                {`${description} (${budget}€)`}
              </Col>
              {editMode && (
                <Col xs={1}>
                  <EditButton onClick={() => onEditAction(_id)} />
                  <DeleteButton
                    onClick={() => {
                      onDeleteAction(action);
                    }}
                  />
                </Col>
              )}
            </Row>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </div>
  );
};

ActionDisplay.propTypes = {
  action: PropTypes.object,
  editMode: PropTypes.any,
  onEditAction: PropTypes.any,
};
