import Moment from "react-moment";
import React from "react";

export const GermanDateString = ({ date }) => {
  return date ? (
    <Moment interval={0} format={"DD.MM.YYYY"}>
      {new Date(date)}
    </Moment>
  ) : (
    "-"
  );
};
