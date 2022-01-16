import { Col, Row } from "react-bootstrap";
import React from "react";
import { TDataMap } from "../../../../types/TDataMap";
// @ts-ignore
import { isArrayWithOneElement } from "../../../../utils/utils";

export const DataMapPreview = ({ dataMap }: { dataMap: TDataMap }) => (
  <>
    <div
      style={{ maxHeight: 200, overflowY: "auto", overflowX: "initial" }}
      className={"w-100"}
    >
      {dataMap.map((entry, k) => (
        <Col className={"mt-2"} key={k}>
          <span className={"font-weight-bold"}>{entry.description}</span>
          {isArrayWithOneElement(entry.values) &&
            entry.values.map((value, i) => (
              <Row key={i}>
                <Col xs={5}>{value.content}</Col>
                <Col xs={5}>{value.value}</Col>
              </Row>
            ))}
        </Col>
      ))}
    </div>
  </>
);
