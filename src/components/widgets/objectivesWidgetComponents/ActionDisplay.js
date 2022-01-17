import { Accordion, Card, Col, Row, useAccordionButton } from "react-bootstrap";
import { EditButton } from "../../shared/EditButton";
import React from "react";
import * as PropTypes from "prop-types";
import { DeleteButton } from "../../shared/DeleteButton";
import { GermanDateString } from "../../shared/GermanDateString";
import ReactMarkdown from "react-markdown";

const CustomToggle = ({ eventKey, badgeStyle, startDate, endDate, title }) => {
  const decoratedOnClick = useAccordionButton(eventKey, () => {});

  return (
    <Row
      style={{ cursor: "pointer" }}
      className={"text-left align-items-baseline"}
      onClick={decoratedOnClick}
    >
      <Col xs={12} sm={4}>
        <Row style={{ ...badgeStyle }} className={"d-flex"}>
          <GermanDateString date={startDate} />
          <span style={{ whiteSpace: "pre" }}>{" bis "}</span>
          <GermanDateString date={endDate} />
        </Row>
      </Col>
      <Col xs={12} sm={8}>
        {title || "Maßnahme"}
      </Col>
    </Row>
  );
};

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
    <Card>
      <Card.Header>
        <CustomToggle
          eventKey={_id}
          title={title}
          badgeStyle={badgeStyle}
          startDate={startDate}
          endDate={endDate}
        />
      </Card.Header>
      <Accordion.Collapse eventKey={_id}>
        <Card.Body>
          <Row xs={12} className={"w-100"}>
            <Col
              xs={editMode ? 11 : 12}
              sm={editMode ? 11 : 12}
              className={"text-left w-100"}
            >
              <ReactMarkdown skipHtml>{description}</ReactMarkdown>
              {`Budget: ${budget}€`}
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
  );
};

ActionDisplay.propTypes = {
  action: PropTypes.object,
  editMode: PropTypes.any,
  onEditAction: PropTypes.any,
};
