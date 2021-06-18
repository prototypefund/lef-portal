import React from "react";

export const WidgetContainer = ({ component, regionData, editMode }) => {
  const Component = React.createElement(component, { regionData, editMode });
  return Component;
};
