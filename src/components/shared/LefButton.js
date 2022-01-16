import { Button } from "react-bootstrap";
import React from "react";

export const LefButton = ({
  className,
  icon,
  iconProps = {},
  title,
  ...rest
}) => {
  const iconComponent = icon
    ? React.createElement(icon, {
        ...iconProps,
        className: "ml-1",
      })
    : null;
  return (
    <Button
      className={`mr-1 d-flex justify-content-center align-items-center p-2 ${
        className ? className : ""
      }"`}
      {...rest}
    >
      {icon ? (
        <>
          {icon && iconComponent}
          <p className={"p-0 m-0 ml-2"}>{title}</p>
        </>
      ) : (
        title
      )}
    </Button>
  );
};
