import { Button } from "react-bootstrap";
import { TrashFill } from "react-bootstrap-icons";
import React from "react";
import * as PropTypes from "prop-types";

export const DeleteButton = (props) => (
  <Button
    variant={"link"}
    className={"ml-2 mb-2"}
    size={"sm"}
    onClick={props.onClick}
  >
    <TrashFill />
  </Button>
);

DeleteButton.propTypes = { onClick: PropTypes.func };
