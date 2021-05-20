import { QuestionCircleFilled } from "@ant-design/icons";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";

export const ResultEntry = ({ question, component }) => (
  <>
    <Row>
      <Col className={"d-flex alert alert-secondary align-items-center"}>
        <div className={"mr-3"}>
          <QuestionCircleFilled style={{ fontSize: 35 }} />
        </div>
        <div style={{ whiteSpace: "pre-wrap" }}>{question}</div>
      </Col>
    </Row>
    <>{component}</>
  </>
);
