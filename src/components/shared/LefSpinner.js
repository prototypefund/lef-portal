import { Container } from "react-bootstrap";
import React from "react";
import lefLogoAnimation from "../../assets/lef_logo_animation.gif";

export const LefSpinner = ({ text, hideBackground = false }) => (
  <Container
    fluid
    className={"align-items-center justify-content-center d-flex flex-column"}
    {...(!hideBackground && {
      style: { backgroundColor: "rgba(200,200,200,0.5)" },
    })}
  >
    <img src={lefLogoAnimation} style={{ width: 300 }} />
    {/*<Spinner animation="border" role="status">
      <span className="sr-only">Lade Daten...</span>
    </Spinner>*/}
    {text && <p>{text}</p>}
  </Container>
);
