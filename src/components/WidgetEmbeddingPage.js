import { useParams } from "react-router-dom";
import { WidgetEmbedding } from "./WidgetEmbedding";

export const WidgetEmbeddingPage = () => {
  const { widgetId, regionId, colorPalette, fontStyle } = useParams();
  return (
    <WidgetEmbedding
      widgetId={widgetId}
      regionId={regionId}
      colorPalette={colorPalette}
      fontStyle={fontStyle}
    />
  );
};
