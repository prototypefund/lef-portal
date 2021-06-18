import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestGetRegion } from "../redux/authSlice";
import { getRegionDataFromState } from "../redux/dataSlice";
import { WidgetContainer } from "./WidgetContainer";
import { ActionDisplay } from "./widgets/objectivesWidgetComponents/ActionDisplay";
import { WeatherWidget } from "./widgets/WeatherWidget";
import { CarsWidget } from "./widgets/CarsWidget";
import { AttitudeWidget } from "./widgets/AttitudeWidget";

const Widgets = {
  1: ActionDisplay,
  2: WeatherWidget,
  3: CarsWidget,
  4: AttitudeWidget,
};

export function WidgetEmbedding() {
  const dispatch = useDispatch();
  const { widgetId, regionId } = useParams();
  const regionData = useSelector((state) =>
    getRegionDataFromState(state, regionId)
  );

  console.debug({ regionData });
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
