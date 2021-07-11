import React, { useContext } from "react";
import { Col, Row } from "react-bootstrap";
import * as PropTypes from "prop-types";
import { Heading } from "../shared/Heading";
import { ThemeContext } from "../theme/ThemeContext";

const textColor = "#222";

const Question = (props) => (
  <Col>
    <Heading
      size={"h4"}
      style={{ whiteSpace: "pre-wrap", lineHeight: "2.2rem" }}
      text={props.question}
    />
  </Col>
);

Question.propTypes = { question: PropTypes.any };
export const ResultEntry = ({ question, component }) => {
  const { theme } = useContext(ThemeContext);
  const { COLOR_TEXT_BRIGHT, LIGHT_BACKGROUND_COLOR } = theme.colors;
  return (
    <>
      <Row>
        <Question question={question} />
      </Row>
      <div
        className={"d-flex align-items-center mt-2 alert pl-4 pr-4 pt-4 pb-4"}
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
};
