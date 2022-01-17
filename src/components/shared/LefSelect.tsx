// @ts-ignore
import { Typeahead } from "react-bootstrap-typeahead";
import React from "react";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { pleaseChoose } from "../../assets/consts";

export interface ITypeAheadOptions {
  label: string;
  value: string;
}

export function LefSelect({
  id,
  options = [],
  onChange = () => {},
  children,
  ...rest
}: {
  options: ITypeAheadOptions[];
  onChange: (value: any) => void;
  children?: object;
  [x: string]: any;
}) {
  return (
    <Typeahead
      id={id}
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
}
