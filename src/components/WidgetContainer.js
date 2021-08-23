import React from "react";

export const WidgetContainer = ({
  component,
  regionData,
  editMode,
  embeddingMode,
  isMobile,
}) => {
  const Component = React.createElement(component, {
    regionData,
    editMode,
    embeddingMode,
    isMobile,
  });
  return Component;
};
