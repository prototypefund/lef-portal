import { Badge, Col, Row } from "react-bootstrap";
import { getYYYYMMDD } from "../../resultPageComponents/AddObjectivesAndActionsDialog";
import { EditButton } from "../../shared/EditButton";
import React from "react";
import * as PropTypes from "prop-types";

export const ActionDisplay = ({ action = {}, editMode, onEditAction }) => {
  const { description, startDate, endDate, budget, _id } = action;
  return (
    <Row xs={12} className={"w-100 mb-1"}>
      <Col xs={6} sm={4}>
        <Row>
          <Col xs={6}>
            <Badge variant={"light"}>{getYYYYMMDD(startDate)}</Badge>
          </Col>
          <Col xs={6}>
            <Badge variant={"light"}>{getYYYYMMDD(endDate)}</Badge>
          </Col>
        </Row>
      </Col>
      <Col xs={editMode ? 11 : 12} sm={editMode ? 7 : 8}>
        {`${description} (${budget}€)`}
      </Col>
      {editMode && (
        <Col xs={1}>
          <EditButton onClick={() => onEditAction(_id)} />
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
