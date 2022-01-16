import { Chart } from "react-chartjs-2";
import React, { useContext } from "react";
// @ts-ignore
import { ThemeContext } from "../../theme/ThemeContext";
import { isArray } from "chart.js/helpers";
// import { defaults } from "react-chartjs-2";
import { ChartType } from "chart.js";

interface ILefLineChartDatasets {
  label: string;
  data: number[];
  yAxisID?: string;
  color: string;
  type: ChartType;
}

interface ILefLineChartData {
  labels: string[];
  datasets: ILefLineChartDatasets[];
}

export function LefLineChart({
  title,
  data,
  y1Min,
  y1Max,
  y2Min,
  y2Max,
  hideScales = false,
}: {
  title?: string;
  data: ILefLineChartData;
  y1Min?: number;
  y1Max?: number;
  y2Min?: number;
  y2Max?: number;
  hideScales?: boolean;
}) {
  // defaults.animation = !disableAnimations;
  const { theme } = useContext(ThemeContext);
  const { DIAGRAM_COLORS = [] } = theme.colors;
  const usedScales = isArray(data.datasets)
    ? data.datasets.map((d) => d.yAxisID)
    : [];

  const options = {
    responsive: true,
    ...(title && { plugins: { title: { display: true, text: title } } }),
    scales: {
      y: {
        /* ticks: {
          beginAtZero: true,
        },*/
        ...(y1Min && { min: y1Min }),
        ...(y1Max && { max: y1Max }),
        type: "linear" as const,
        display: !hideScales,
        position: "left" as const,
      },
      y1: {
        ...(y2Min && { min: y2Min }),
        ...(y2Max && { max: y2Max }),
        type: "linear" as const,
        display: !hideScales,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  Object.keys(options.scales).forEach((key) => {
    if (!usedScales.includes(key)) {
      // @ts-ignore
      delete options.scales[key];
    }
  });

  const convertedData = data.datasets.map((entry, i) => {
    const color = entry.color || DIAGRAM_COLORS[i % DIAGRAM_COLORS.length];
    return {
      label: entry.label,
      data: entry.data,
      borderColor: color,
      backgroundColor: color,
      type: entry.type,
      yAxisID: entry.yAxisID,
    };
  });

  return (
    <Chart
      type={"bar"}
      data={{
        labels: data.labels,
        datasets: convertedData,
      }}
      options={options}
    />
  );
}
