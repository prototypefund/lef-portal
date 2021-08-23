import { useContext, useEffect } from "react";
import { WidgetContainer } from "./WidgetContainer";
import { ThemeContext } from "./theme/ThemeContext";
import { WIDGETS } from "./widgets/getWidget";
import { useGetRegionQuery } from "../redux/lefReduxApi";
import { SpinnerWrapper } from "./shared/SpinnerWrapper";
import { isMobile } from "react-device-detect";

export function WidgetEmbedding({
  colorPalette,
  fontStyle,
  regionId,
  widgetId,
}) {
  const { updateTheme } = useContext(ThemeContext);

  const {
    data: regionData = {},
    isFetching: isFetchingRegion,
  } = useGetRegionQuery(regionId);

  useEffect(() => {
    updateTheme(colorPalette, fontStyle);
  }, [colorPalette, fontStyle]);

  let widget = WIDGETS[widgetId] ? WIDGETS[widgetId].component : undefined;

  return widget ? (
    <SpinnerWrapper loading={isFetchingRegion}>
      <div className={"d-flex flex-grow-1 m-2"}>
        <WidgetContainer
          isMobile={isMobile}
          embeddingMode
          regionData={regionData}
          editMode={false}
          component={widget}
        />{" "}
      </div>
    </SpinnerWrapper>
  ) : (
    <p>Das angeforderte Widget ist nicht vorhanden.</p>
  );
}
