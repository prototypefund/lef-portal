import { Line } from "react-chartjs-2";
import React from "react";
import { DIAGRAM_COLORS } from "../../../assets/colors";

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

export function LefLineChart({ data }) {
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
          };
        }),
      }}
      options={options}
    />
  );
}
