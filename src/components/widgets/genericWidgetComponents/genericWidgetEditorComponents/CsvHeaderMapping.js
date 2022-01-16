import { Col, Row } from "react-bootstrap";
import { LefSelect } from "../../../shared/LefSelect";
import { isArrayWithOneElement } from "../../../../utils/utils";
import React from "react";

export const CsvHeaderMapping = ({ headers, updateMapping }) => {
  const VALUES_TO_MAP = [
    {
      label: "Zeitpunkte",
      id: "timestamp",
      description: "• enthält den Zeitpunkt des Eintrags (z.B. 01-03-1990)",
    },
    {
      label: "Bezeichnung",
      id: "description",
      description:
        "• enthält die (lesbare) Bezeichnung des Zeitpunkts (z.B. März 1990)\n• kann identisch mit oben angegebener Spalte sein",
    },
    {
      label: "Kategorien",
      id: "content",
      description: "• enthält die Kategorie des Eintrags (z.B. Verkehr, Strom)",
    },
    {
      label: "Werte",
      id: "value",
      description: "• enthält den Zahlenwert des Eintrags (z.B. 8.4)",
    },
  ];
  return (
    <>
      {VALUES_TO_MAP.map((entry, l) => (
        <Row key={entry.id} className={"mb-1"}>
          <Col xs={12} lg={3} xl={2}>
            <Row>{entry.label}</Row>
          </Col>
          <Col xs={12} lg={9} xl={10}>
            <div>
              <LefSelect
                clearButton
                placeholder={"Bitte Spalte auswählen.."}
                id={l}
                onChange={(selected) =>
                  isArrayWithOneElement(selected) &&
                  updateMapping(entry.id, selected[0].value)
                }
                options={headers.map((header, i) => ({
                  label: `${i + 1}. ${header}`,
                  value: i,
                }))}
              />
            </div>
            <div className={"mb-3"}>
              <small style={{ whiteSpace: "pre-wrap" }}>
                {entry.description}
              </small>
            </div>
          </Col>
        </Row>
      ))}
    </>
  );
};
