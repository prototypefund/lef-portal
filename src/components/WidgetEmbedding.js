import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRegionDataFromState, requestGetRegion } from "../redux/dataSlice";
import { WidgetContainer } from "./WidgetContainer";
import { ActionDisplay } from "./widgets/objectivesWidgetComponents/ActionDisplay";
import { ClimateWidget } from "./widgets/ClimateWidget";
import { CarsWidget } from "./widgets/CarsWidget";
import { VotingWidget } from "./widgets/VotingWidget";

const Widgets = {
  1: ActionDisplay,
  2: ClimateWidget,
  3: CarsWidget,
  4: VotingWidget,
};

export function WidgetEmbedding() {
  const dispatch = useDispatch();
  const { widgetId, regionId } = useParams();
  const regionData = useSelector((state) =>
    getRegionDataFromState(state, regionId)
  );

  useEffect(() => {
    dispatch(requestGetRegion(regionId));
  }, [dispatch, regionId]);

  let widget = Widgets[widgetId] || undefined;

  return widget ? (
    <div className={"d-flex flex-grow-1 m-2"}>
      <WidgetContainer
        regionData={regionData}
        editMode={false}
        component={widget}
      />{" "}
    </div>
  ) : (
    <p>Das angeforderte Widget ist nicht vorhanden.</p>
  );
}
