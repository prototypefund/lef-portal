import { TDataMap } from "./TDataMap";
import { ChartType } from "chart.js";
import { CHART_TYPES } from "../components/widgets/genericWidgetComponents/GenericWidgetEditor";

export type TLefChartType = "bar" | "line" | "cake" | "scatter";

export interface IGenericWidget {
  _id: string;
  title: String;
  description: String;
  objectType: String;
  chartType: TLefChartType;
  dataMap: TDataMap;
}
