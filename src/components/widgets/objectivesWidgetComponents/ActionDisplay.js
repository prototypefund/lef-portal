import { Accordion, Card, Col, Row } from "react-bootstrap";
import { getYYYYMMDD } from "../../resultPageComponents/AddObjectivesAndActionsDialog";
import { EditButton } from "../../shared/EditButton";
import React from "react";
import * as PropTypes from "prop-types";
import { DeleteButton } from "../../shared/DeleteButton";

export const ActionDisplay = ({
  action = {},
  editMode,
  onEditAction,
  onDeleteAction,
}) => {
  let badgeStyle = {
    // backgroundColor: "white",
    padding: 0,
    marginBottom: 5,
    fontSize: 11,
    whiteSpace: "no-wrap",
    width: "100%",
  };

  const { description, startDate, endDate, budget, _id } = action;
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
              <Col xs={4}>
                <div style={{ ...badgeStyle }}>{`${getYYYYMMDD(
                  startDate
                )} - ${getYYYYMMDD(endDate)}`}</div>
              </Col>
              <Col xs={6}>{_id}</Col>
            </Row>
          </Card.Header>
        </Accordion.Toggle>

        <Accordion.Collapse eventKey={_id}>
          <Card.Body>
            <Row xs={12} className={"w-100"}>
              <Col
                xs={editMode ? 9 : 12}
                sm={editMode ? 6 : 9}
                className={"text-left"}
              >
                {`${description} (${budget}€)`}
              </Col>
              {editMode && (
                <Col xs={3}>
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
