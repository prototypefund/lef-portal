import { Typeahead } from "react-bootstrap-typeahead";
import React from "react";
import { pleaseChoose } from "../../assets/consts";

export const LefSelect = ({ options = [], onChange = () => {}, ...rest }) => (
  <Typeahead
    highlightOnlyResult
    placeholder={pleaseChoose}
    emptyLabel={"Keine Ergebnisse."}
    paginationText={"mehr.."}
    options={options}
    onChange={onChange}
    {...rest}
  />
);
