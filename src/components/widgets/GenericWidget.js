import React, { useState } from "react";
import { useGetGenericChartQuery } from "../../redux/lefReduxApi";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import { LefGenericChart } from "./genericWidgetComponents/LefGenericChart";
import { GenericWidgetEditor } from "./genericWidgetComponents/GenericWidgetEditor";
import { ResultEntry } from "../resultPageComponents/ResultEntry";

export const GenericWidget = ({ editMode, active, widgetId }) => {
  const [editorOpen, setEditorOpen] = useState(false);
  const { data: genericChartData = {} } = useGetGenericChartQuery(widgetId);
  const { description, title } = genericChartData;

  return (
    <>
      {editorOpen && (
        <GenericWidgetEditor
          open={editorOpen}
          currentObject={genericChartData}
          onClose={() => setEditorOpen(false)}
        />
      )}

      <ResultEntry
        buttons={[
          {
            icon: TrashFill,
            title: "",
            variant: "danger",
            onClick: () => {
              // TODO GenericChart entfernen
            },
          },
          {
            icon: PencilFill,
            title: "",
            onClick: () => setEditorOpen(true),
          },
        ]}
        showEditButton
        onEditClick={() => setEditorOpen(true)}
        editMode={editMode}
        component={
          <>
            <LefGenericChart genericChart={genericChartData} />
            <p>{description}</p>
          </>
        }
        question={title}
        active={active}
        onToggleActive={(newActive) => {
          // TODO GenericChart aktivieren/deaktivieren
        }}
      />
    </>
  );
};
