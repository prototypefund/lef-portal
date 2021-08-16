import { Line } from "react-chartjs-2";
import React, { useContext } from "react";
import { ThemeContext } from "../../theme/ThemeContext";
import { isArray } from "chart.js/helpers";
// import { defaults } from "react-chartjs-2";

export function LefLineChart({ data = {}, y1Min, y1Max, y2Min, y2Max }) {
  // defaults.animation = !disableAnimations;
  const { theme } = useContext(ThemeContext);
  const { DIAGRAM_COLORS = [] } = theme.colors;
  const usedScales = isArray(data.datasets)
    ? data.datasets.map((d) => d.yAxisID)
    : [];

  let options = {
    responsive: true,
    scales: {
      y1: {
        type: "linear",
        position: "left",
        display: true,
        ticks: {
          beginAtZero: true,
        },
        ...(y1Min && { min: y1Min }),
        ...(y1Max && { max: y1Max }),
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        ...(y2Min && { min: y2Min }),
        ...(y2Max && { max: y2Max }),
      },
    },
  };

  Object.keys(options.scales).forEach((key) => {
    if (!usedScales.includes(key)) {
      delete options.scales[key];
    }
  });

  console.debug(data);
  return (
    <Line
      data={{
        labels: data.labels,
        datasets: data.datasets.map((entry, i) => {
          const color =
            entry.color || DIAGRAM_COLORS[i % DIAGRAM_COLORS.length];
          return {
            backgroundColor: color,
            borderColor: color,
            label: entry.label,
            data: entry.data,
            yAxisID: entry.yAxisID,
            type: entry.type || "line",
          };
        }),
      }}
      options={options}
    />
  );
}
