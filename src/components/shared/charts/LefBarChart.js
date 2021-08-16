import { Bar } from "react-chartjs-2";
import React, { useContext } from "react";
import { ThemeContext } from "../../theme/ThemeContext";

export function LefBarChart({
  data,
  isPercent = false,
  xTitle = "",
  yMin,
  yMax,
}) {
  const { theme } = useContext(ThemeContext);
  const { DIAGRAM_COLORS = [] } = theme.colors;

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: Boolean(xTitle),
        text: xTitle,
        position: "bottom",
      },
    },
    scales: {
      y: {
        stacked: true,
        ...(isPercent && { min: 0, max: 100 }),
        ...(yMin && { min: yMin }),
        ...(yMax && { max: yMax }),
      },
      x: {
        stacked: true,
      },
    },
  };

  return (
    <Bar
      type={"bar"}
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
