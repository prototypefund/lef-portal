import React, { useState } from "react";
import { useGetGenericChartQuery } from "../../redux/lefReduxApi";
import { Heading } from "../shared/Heading";
import { LefButton } from "../shared/LefButton";
import { PencilFill } from "react-bootstrap-icons";
import { LefModal } from "../shared/LefModal";
import { LefGenericChart } from "./genericWidgetComponents/LefGenericChart";
import { GenericWidgetEditor } from "./genericWidgetComponents/GenericWidgetEditor";
import { Row } from "react-bootstrap";

export const GenericWidget = ({ regionData, editMode, widgetProps = {} }) => {
  const [editorOpen, setEditorOpen] = useState(false);
  const { widgetId } = widgetProps;
  const { data: genericChartData = {} } = useGetGenericChartQuery(widgetId);
  const { description, title } = genericChartData;
  console.debug({ genericChartData, widgetProps });

  return (
    <>
      {editorOpen && (
        <GenericWidgetEditor
          open={editorOpen}
          currentObject={genericChartData}
          onClose={() => setEditorOpen(false)}
        />
      )}

      {editMode && (
        <Row className={"w-100"}>
          <div className={"ml-auto"}>
            <LefButton
              icon={PencilFill}
              title={"Widget bearbeiten"}
              onClick={() => setEditorOpen(true)}
            />
          </div>
        </Row>
      )}
      <Heading size={"h5"} text={title} />
      <LefGenericChart genericChart={genericChartData} />
      <p>{description}</p>
    </>
  );
};
