import { Col, Container, Row } from "react-bootstrap";
import BmbfLogo from "../assets/bmbf_logo.jpg";
import PrototypeLogo from "../assets/prototypefund_logo.jpg";

export function LefFooter({ showLogos = true, showLinks = true }) {
  return (
    <Container fluid>
      <hr />
      {showLogos && (
        <Row
          className={
            "ml-1 mr-1 align-items-center justify-content-around d-flex"
          }
        >
          <Col xs={12} sm={"auto"}>
            <img
              src={BmbfLogo}
              alt={"BMBF Logo"}
              style={{ height: 120, marginRight: 10 }}
            />
          </Col>
          <Col xs={12} sm={"auto"}>
            <img
              src={PrototypeLogo}
              alt={"Prototype Fund Logo"}
              style={{ height: 70, marginRight: 10 }}
            />
          </Col>
        </Row>
      )}
      {showLinks && (
        <Row className={"align-items-center d-flex justify-content-center"}>
          {[
            {
              id: "1",
              label: "Datenschutzerklärung",
              to: "https://emission-framework.org/datenschutzerklaerung/",
            },
            {
              id: "2",
              label: "Impressum",
              to: "https://emission-framework.org/impressum/",
            },
          ].map((link, i) => (
            <Col xs={"auto"} key={i}>
              <a style={{ fontSize: "0.7em" }} href={link.to}>
                {link.label}
              </a>
            </Col>
          ))}
        </Row>
      )}
      <Row className={"d-flex justify-content-center mt-3"}>
        <Col xs={"auto"}>
          <Row style={{ fontSize: 10 }}>
            Local Emission Framework 2021 (c) v0.1
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
