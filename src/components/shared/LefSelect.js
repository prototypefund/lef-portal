import { Typeahead } from "react-bootstrap-typeahead";
import React from "react";
import { pleaseChoose } from "../../assets/consts";
import "react-bootstrap-typeahead/css/Typeahead.css";

export const LefSelect = ({
  options = [],
  onChange = () => {},
  children,
  ...rest
}) => (
  <Typeahead
    highlightOnlyResult
    placeholder={pleaseChoose}
    emptyLabel={"Keine Ergebnisse."}
    paginationText={"mehr.."}
    options={options}
    onChange={onChange}
    {...rest}
  >
    {children}
  </Typeahead>
);
