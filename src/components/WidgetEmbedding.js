import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestGetRegion } from "../redux/authSlice";
import { getWidget } from "./widgets/getWidget";

export function WidgetEmbedding() {
  const dispatch = useDispatch();
  const { widgetId, regionId } = useParams();
  const regionData =
    useSelector((state) => state.data.regionData[regionId]) || {};

  useEffect(() => {
    dispatch(requestGetRegion(regionId));
  }, [dispatch, regionId]);

  const widget = getWidget(widgetId, regionData);

  return widget ? (
    <div className={"d-flex flex-grow-1"}>{widget.component}</div>
  ) : (
    <p>Lade Daten..</p>
  );
}
