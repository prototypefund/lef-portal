import { QuestionCircleFilled } from "@ant-design/icons";
import React from "react";
import { Col, Row } from "react-bootstrap";
import * as PropTypes from "prop-types";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../../assets/colors";

const Question = (props) => (
  <Col
    className={"d-flex alert alert-secondary align-items-center"}
    style={{
      border: `2px solid ${PRIMARY_COLOR}`,
      backgroundColor: PRIMARY_COLOR,
      color: "#EFEFEF",
    }}
  >
    <div className={"mr-3"}>
      <QuestionCircleFilled style={{ fontSize: 35, color: "#EEE" }} />
    </div>
    <div style={{ whiteSpace: "pre-wrap" }}>{props.question}</div>
  </Col>
);

Question.propTypes = { question: PropTypes.any };
export const ResultEntry = ({ question, component }) => (
  <>
    <Row>
      <Question question={question} />
    </Row>
    <div>{component}</div>
    <hr style={{ margin: 60 }} />
  </>
);
