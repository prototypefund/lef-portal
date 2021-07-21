import React, { useContext } from "react";
import { Form, FormCheck, Row } from "react-bootstrap";
import { ThemeContext } from "../theme/ThemeContext";
import { Question } from "./Question";
import { useDispatch } from "react-redux";
import { requestUpdateRegion } from "../../redux/dataSlice";

const textColor = "#222";

export const ResultEntry = ({
  question,
  component,
  editMode,
  active,
  onToggleActive,
}) => {
  const { theme } = useContext(ThemeContext);
  const { COLOR_TEXT_BRIGHT, LIGHT_BACKGROUND_COLOR } = theme.colors;
  return (
    <>
      <Row>
        <Question question={question} />
      </Row>
      {editMode && (
        <div onClick={(event) => onToggleActive(!active)}>
          <FormCheck
            type={"switch"}
            className={"mt-2 mb-3"}
            checked={active}
            label={"Widget anzeigen"}
          />
        </div>
      )}
      {active && (
        <div
          className={"d-flex align-items-center mt-2 alert p-sm-1 p-md-4"}
          style={{
            paddingRight: 0,
            border: `2px solid ${COLOR_TEXT_BRIGHT}`,
            backgroundColor: LIGHT_BACKGROUND_COLOR,
            color: textColor,
            overflow: "auto",
          }}
        >
          {component}
        </div>
      )}
      <hr style={{ margin: 50 }} />
    </>
  );
};
