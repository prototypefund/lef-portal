import { TDataMap } from "./TDataMap";
import { ChartType } from "chart.js";

export interface IGenericWidget {
  title: String;
  description: String;
  objectType: String;
  chartType: ChartType;
  dataMap: TDataMap;
}
