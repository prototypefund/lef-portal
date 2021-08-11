import { Container } from "react-bootstrap";
import React from "react";
import lefLogoAnimation from "../../assets/lef_logo_animation.gif";

export const LefSpinner = ({
  text,
  hideBackground = false,
  height = 200,
  horizontal = false,
}) => (
  <Container
    fluid
    className={"align-items-center justify-content-center d-flex flex-column"}
    {...(!hideBackground && {
      style: { backgroundColor: "rgba(200,200,200,0.5)" },
    })}
  >
    <img
      alt={"Ladebalken"}
      src={lefLogoAnimation}
      style={{ height, ...(horizontal && { transform: "rotateZ(-90deg)" }) }}
    />
    {text && <p>{text}</p>}
  </Container>
);
