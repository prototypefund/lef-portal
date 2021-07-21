import { Col } from "react-bootstrap";
import { Heading } from "../shared/Heading";
import React from "react";
import * as PropTypes from "prop-types";

export const Question = (props) => (
  <Col>
    <Heading
      size={"h4"}
      style={{ whiteSpace: "pre-wrap", lineHeight: "2.2rem" }}
      text={props.question}
    />
  </Col>
);

Question.propTypes = { question: PropTypes.string };
