import React, { useContext } from "react";
import { Col, Collapse, FormCheck, Row } from "react-bootstrap";
import { ThemeContext } from "../theme/ThemeContext";
import { Question } from "./Question";
import { SourceDisplay } from "../shared/SourceDisplay";
import { isMobile } from "react-device-detect";
import { LefButton } from "../shared/LefButton";
import ErrorBoundary from "../widgets/genericWidgetComponents/ErrorBoundary";

const textColor = "#222";

export const ResultEntry = ({
  buttons,
  question,
  component,
  editMode,
  active,
  onToggleActive,
  sources,
}) => {
  const mobileMode = isMobile;
  const { theme } = useContext(ThemeContext);
  const { COLOR_TEXT_BRIGHT, LIGHT_BACKGROUND_COLOR } = theme.colors;
  return (
    <ErrorBoundary>
      <Row>
        <Question question={question} />
      </Row>
      <Collapse in={editMode}>
        <Row className={""}>
          <Col>
            <div onClick={() => onToggleActive(!active)}>
              <FormCheck
                type={"switch"}
                className={"mt-2 mb-3"}
                checked={active}
                label={"Widget anzeigen"}
                onChange={() => {}}
              />
            </div>
          </Col>
          {buttons && (
            <Col className={"justify-content-end d-flex"}>
              {buttons.map((button, p) => (
                <LefButton key={p} size={"sm"} {...button} />
              ))}
            </Col>
          )}
        </Row>
      </Collapse>
      {active &&
        (mobileMode ? (
          <div
            className={"align-items-center mt-2"}
            style={{
              margin: 0,
              paddingTop: 5,
              paddingBottom: 5,
              backgroundColor: LIGHT_BACKGROUND_COLOR,
              color: textColor,
              overflow: "auto",
            }}
          >
            {component}
          </div>
        ) : (
          <Row>
            <Col>
              <div
                className={
                  "d-flex align-items-center mt-2 alert p-sm-1 p-md-4 flex-column"
                }
                style={{
                  paddingRight: 0,
                  border: `2px solid ${COLOR_TEXT_BRIGHT}`,
                  backgroundColor: LIGHT_BACKGROUND_COLOR,
                  color: textColor,
                  overflow: "auto",
                }}
              >
                {component}
                <SourceDisplay sources={sources} />
              </div>
            </Col>
          </Row>
        ))}
      <hr style={{ margin: 50 }} />
    </ErrorBoundary>
  );
};
