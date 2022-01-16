import React, { useEffect, useState } from "react";
import {
  useDeleteGenericChartMutation,
  useGetGenericChartQuery,
  useUpdateRegionMutation,
} from "../../redux/lefReduxApi";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import { LefGenericChart } from "./genericWidgetComponents/LefGenericChart";
import { GenericWidgetEditor } from "./genericWidgetComponents/GenericWidgetEditor";
import { ResultEntry } from "../resultPageComponents/ResultEntry";
import { LefSpinner } from "../shared/LefSpinner";
import { LefModal } from "../shared/LefModal";

export const GenericWidget = ({ editMode, active, widgetId, regionData }) => {
  const [
    updateRegion,
    { isSuccess: updatedRegion, isLoading: updatingRegion },
  ] = useUpdateRegionMutation();
  const [
    deleteGenericChart,
    { isSuccess: deletedGenericChart, loading: deletingGenericChart },
  ] = useDeleteGenericChartMutation();
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const {
    data: genericChartData = {},
    isFetching: loadingGenericChart,
  } = useGetGenericChartQuery(widgetId);
  const { description, title } = genericChartData;

  useEffect(() => {
    if (deletedGenericChart) {
      updateRegion({
        ...regionData,
        customWidgets: regionData.customWidgets.filter(
          (w) => w.widgetId !== widgetId
        ),
      });
    }
  }, [deletedGenericChart]);

  useEffect(() => {
    if (updatedRegion) {
      setDeleteDialogOpen(false);
    }
  }, [updatedRegion]);

  return (
    <>
      {editorOpen && (
        <GenericWidgetEditor
          open={editorOpen}
          currentObject={genericChartData}
          onClose={() => setEditorOpen(false)}
          regionData={regionData}
        />
      )}

      <LefModal
        title={"Widget löschen"}
        buttons={[
          {
            label: "Abbrechen",
            variant: "secondary",
            onClick: () => setDeleteDialogOpen(false),
          },
          {
            label: "Löschen",
            loading: deletingGenericChart,
            onClick: () => {
              deleteGenericChart(widgetId);
            },
          },
        ]}
        show={deleteDialogOpen}
        content={
          <>
            <p>{`Wollen Sie das Widget`}</p>
            <p className={"font-italic alert"}>{title}</p>
            <p>{`wirklich löschen?`}</p>
          </>
        }
      />

      {loadingGenericChart || deletingGenericChart || updatingRegion ? (
        <LefSpinner hideBackground />
      ) : (
        <ResultEntry
          buttons={[
            {
              icon: TrashFill,
              title: "",
              variant: "danger",
              onClick: () => {
                setDeleteDialogOpen(true);
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
            updateRegion({
              ...regionData,
              customWidgets: regionData.customWidgets.map((widget) => {
                if (widget.widgetId === widgetId) {
                  return { ...widget, isActive: newActive };
                }
                return widget;
              }),
            });
          }}
        />
      )}
    </>
  );
};
