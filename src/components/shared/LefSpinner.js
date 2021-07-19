import { Container, Spinner } from "react-bootstrap";
import React from "react";

export const LefSpinner = () => (
  <Container
    fluid
    className={"align-items-center justify-content-center d-flex"}
  >
    <Spinner animation="border" role="status">
      <span className="sr-only">Lade Daten...</span>
    </Spinner>
  </Container>
);
