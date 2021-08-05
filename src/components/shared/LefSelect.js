import { Typeahead } from "react-bootstrap-typeahead";
import React from "react";
import { pleaseChoose } from "../../assets/consts";

export const LefSelect = (props) => (
  <Typeahead
    highlightOnlyResult
    placeholder={pleaseChoose}
    emptyLabel={"Keine Ergebnisse."}
    {...props}
  />
);
