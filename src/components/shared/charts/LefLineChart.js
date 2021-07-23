import { Line } from "react-chartjs-2";
import React, { useContext } from "react";
import { ThemeContext } from "../../theme/ThemeContext";

const options = {
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

export function LefLineChart({ data }) {
  const { theme } = useContext(ThemeContext);
  const { DIAGRAM_COLORS = [] } = theme.colors;
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
