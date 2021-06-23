import { Badge, Col, Row } from "react-bootstrap";
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
  const { description, startDate, endDate, budget, _id } = action;
  return (
    <Row xs={12} className={"w-100 mb-1"}>
      <Col xs={6} sm={editMode ? 3 : 3}>
        <Col xs={12}>
          <Row xs={12} className={"mb-1"}>
            <Badge variant={"light"}>{getYYYYMMDD(startDate)}</Badge>
          </Row>
          <Row xs={12}>
            <Badge variant={"light"}>{getYYYYMMDD(endDate)}</Badge>
          </Row>
        </Col>
      </Col>
      <Col xs={editMode ? 9 : 12} sm={editMode ? 6 : 9}>
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
  );
};

ActionDisplay.propTypes = {
  action: PropTypes.object,
  editMode: PropTypes.any,
  onEditAction: PropTypes.any,
};
