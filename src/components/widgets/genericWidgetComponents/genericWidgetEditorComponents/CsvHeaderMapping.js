import { Col, Row } from "react-bootstrap";
import { LefSelect } from "../../../shared/LefSelect";
import { isArrayWithOneElement } from "../../../../utils/utils";
import React from "react";

export const CsvHeaderMapping = ({ headers, updateMapping }) => {
  const VALUES_TO_MAP = [
    { label: "Kategorien", id: "content" },
    { label: "Werte", id: "value" },
    { label: "Zeitpunkte", id: "timestamp" },
    { label: "Beschreibungen", id: "description" },
  ];
  return (
    <>
      {VALUES_TO_MAP.map((entry, l) => (
        <Row key={entry.id} className={"mb-1"}>
          <Col>{entry.label}</Col>
          <Col>
            <LefSelect
              id={l}
              onChange={(selected) =>
                isArrayWithOneElement(selected) &&
                updateMapping(entry.id, selected[0].value)
              }
              options={headers.map((header, i) => ({
                label: header,
                value: i,
              }))}
            />{" "}
          </Col>
        </Row>
      ))}
    </>
  );
};
