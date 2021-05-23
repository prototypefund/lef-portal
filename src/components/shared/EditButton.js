import { Button } from "react-bootstrap";
import { PencilFill } from "react-bootstrap-icons";
import React from "react";
import * as PropTypes from "prop-types";

export const EditButton = (props) => (
  <Button
    variant={"link"}
    className={"ml-2 mb-2"}
    size={"sm"}
    onClick={props.onClick}
  >
    <PencilFill />
  </Button>
);

EditButton.propTypes = { onClick: PropTypes.func };
