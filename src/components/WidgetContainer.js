import React from "react";

export const WidgetContainer = ({ component, regionData, editMode }) => {
  const Component = React.cloneElement(component, { regionData, editMode });
  return <Component />;
};
