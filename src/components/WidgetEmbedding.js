import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRegionDataFromState, requestGetRegion } from "../redux/dataSlice";
import { WidgetContainer } from "./WidgetContainer";
import { ThemeContext } from "./theme/ThemeContext";
import { WIDGETS } from "./widgets/getWidget";

export function WidgetEmbedding({
  colorPalette,
  fontStyle,
  regionId,
  widgetId,
}) {
  const dispatch = useDispatch();
  const { updateTheme } = useContext(ThemeContext);

  const regionData = useSelector((state) =>
    getRegionDataFromState(state, regionId)
  );

  useEffect(() => {
    updateTheme(colorPalette, fontStyle);
  }, [updateTheme, colorPalette, fontStyle]);

  useEffect(() => {
    if (regionId) {
      dispatch(requestGetRegion(regionId));
    }
  }, [dispatch, regionId]);

  let widget = WIDGETS[widgetId] ? WIDGETS[widgetId].component : undefined;

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
