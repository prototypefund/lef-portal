import React, { MouseEventHandler } from "react";

type Props = {
  onClick: MouseEventHandler;
  text: string;
};

const TsButton = ({ onClick, text }: Props) => <p onClick={onClick}>{text}</p>;

export default TsButton;
