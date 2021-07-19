import { Button } from "react-bootstrap";
import { PencilFill } from "react-bootstrap-icons";
import React from "react";
import * as PropTypes from "prop-types";

export const EditButton = (props) => (
  <Button
    variant={"link"}
    className={"ml-2 mb-1 p-2 d-flex align-items-center"}
    size={"sm"}
    onClick={props.onClick}
    {...props}
  >
    <PencilFill />
    {props.title && (
      <span style={{ whiteSpace: "pre" }}>{`  ${props.title}`}</span>
    )}
  </Button>
);

EditButton.propTypes = { onClick: PropTypes.func };
