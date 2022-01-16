// @ts-ignore
import { isArrayWithOneElement } from "../../../utils/utils";
import React from "react";
import { IGenericWidget } from "../../../types/IGenericWidget";
import { LefLineChart } from "../../shared/charts/LefLineChart";
// @ts-ignore
import { LefBarChart } from "../../shared/charts/LefBarChart";
import { ChartType } from "chart.js";

export function LefGenericChart({
  genericChart,
}: {
  genericChart: IGenericWidget;
}) {
  const { chartType, dataMap = [] } = genericChart;

  const xLabels = dataMap.map((d) => d.description);
  if (!isArrayWithOneElement(dataMap)) {
    return null;
  }
  const firstDataset = dataMap[0];
  const { values = [] } = firstDataset;
  const yLabels = values.map((v) => v.content);
  const yColors = values.map((v) => v.color);
  const datasets = yLabels.map((v, i) => ({
    label: v,
    type: "line" as ChartType,
    color: yColors[i],
    data: dataMap.map((d) => {
      const entry = d.values.find((vl) => vl.content === yLabels[i]);
      return entry ? entry.value : 0;
    }),
  }));

  const data = { labels: xLabels, datasets: datasets };
  return chartType === "line" ? (
    <LefLineChart hideScales data={data} />
  ) : chartType === "bar" ? (
    <LefBarChart data={data} />
  ) : (
    <>{"Anzeigeformat derzeit nicht verfügbar."}</>
  );
}
