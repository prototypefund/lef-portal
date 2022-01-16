import React from "react";

export const Heading = ({
  text,
  size,
  style,
  ...rest
}: {
  text: String;
  size: String;
  style?: object;
}) => {
  switch (size) {
    case "h3":
      return <h3 {...rest}>{text}</h3>;
    case "h2":
      return <h2 {...rest}>{text}</h2>;
    case "h5":
      return <h5 {...rest}>{text}</h5>;
    case "h6":
      return <h6 {...rest}>{text}</h6>;
    case "h4":
      return (
        <p className={"h4"} style={{ ...style, margin: 0 }}>
          {text}
        </p>
      );
    default:
      return <h1 {...rest}>{text}</h1>;
  }
};
