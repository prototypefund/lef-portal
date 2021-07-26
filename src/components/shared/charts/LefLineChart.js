import { Line } from "react-chartjs-2";
import React, { useContext } from "react";
import { ThemeContext } from "../../theme/ThemeContext";
import { isArray } from "chart.js/helpers";

export function LefLineChart({ data = {} }) {
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
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  Object.keys(options.scales).forEach((key) => {
    if (!usedScales.includes(key)) {
      delete options.scales[key];
    }
  });
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
          };
        }),
      }}
      options={options}
    />
  );
}
