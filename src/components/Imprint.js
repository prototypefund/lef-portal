import { Heading } from "./shared/Heading";
import { Col, Row } from "react-bootstrap";

export const Imprint = () => (
  <Col>
    <Row>
      <Heading size={"h1"} text={"Impressum"} />
    </Row>
    <Row>
      <p>Stein Timme Edelkötter Rohmund GbR Aegidistr. 27, 48143, Münster</p>
    </Row>
    <Row>
      <a href={"https://emission-framework.org/"}>
        https://emission-framework.org/
      </a>
    </Row>
  </Col>
);
