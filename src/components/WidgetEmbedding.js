import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestGetRegion } from "../redux/authSlice";
import { getWidget } from "./widgets/getWidget";
import { getRegionDataFromState } from "../redux/dataSlice";

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

  const widget = getWidget(widgetId, regionData);

  return widget ? (
    <div className={"d-flex flex-grow-1 m-2"}>{widget.component}</div>
  ) : (
    <p>Das angeforderte Widget ist nicht vorhanden.</p>
  );
}
