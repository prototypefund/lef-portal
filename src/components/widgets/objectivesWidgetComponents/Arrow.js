import { ArrowLeftCircle, ArrowRightCircle } from "react-bootstrap-icons";
import React from "react";

export const Arrow = ({ left = false, onClick = () => alert("What"), show }) =>
  show ? (
    <div
      onClick={onClick}
      className={
        "h-100 position-absolute align-items-center justify-content-center d-flex"
      }
      style={{
        cursor: "pointer",
        width: 20,
        backgroundColor: "rgba(100,100,100,0.0)",
        zIndex: 10000,
        top: 0,
        ...(left ? { left: 0 } : { right: 0 }),
      }}
    >
      {left ? <ArrowLeftCircle /> : <ArrowRightCircle />}
    </div>
  ) : (
    <></>
  );
