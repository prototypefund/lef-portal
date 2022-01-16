import { TDataMap } from "./TDataMap";
import { ChartType } from "chart.js";

export interface IGenericWidget {
  _id: string;
  title: String;
  description: String;
  objectType: String;
  chartType: ChartType;
  dataMap: TDataMap;
}
