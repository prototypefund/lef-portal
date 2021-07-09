import { QuestionCircleFilled } from "@ant-design/icons";
import React from "react";
import { Col, Row } from "react-bootstrap";
import * as PropTypes from "prop-types";
import {
  INTERACTIVE_ELEMENT_COLOR,
  COLOR_TEXT_BRIGHT,
  COLOR_TEXT_DARK,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  LIGHT_BACKGROUND_COLOR,
} from "../../assets/colors";
import { Heading } from "../shared/Heading";

const textColor = "#222";

const Question = (props) => (
  <Col>
    {/*<div className={"mr-3"}>
      <QuestionCircleFilled style={{ fontSize: 35, color: textColor }} />
    </div>*/}
    <Heading
      size={"h4"}
      style={{ whiteSpace: "pre-wrap" }}
      text={props.question}
    />
  </Col>
);

Question.propTypes = { question: PropTypes.any };
export const ResultEntry = ({ question, component }) => (
  <>
    <Row>
      <Question question={question} />
    </Row>
    <div
      className={"d-flex align-items-center mt-2 alert"}
      style={{
        border: `2px solid ${COLOR_TEXT_BRIGHT}`,
        backgroundColor: LIGHT_BACKGROUND_COLOR,
        color: textColor,
        overflow: "auto",
      }}
    >
      {component}
    </div>
    <hr style={{ margin: 50 }} />
  </>
);
