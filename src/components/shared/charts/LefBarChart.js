import { Bar } from "react-chartjs-2";
import React, { useContext } from "react";
import { ThemeContext } from "../../theme/ThemeContext";

export function LefBarChart({
  data,
  isPercent = false,
  xTitle = "",
  yMin,
  yMax,
  isMobile = false,
}) {
  const { theme } = useContext(ThemeContext);
  const { DIAGRAM_COLORS = [] } = theme.colors;

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: Boolean(xTitle),
        text: xTitle,
      },
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      y: {
        display: false,
        stacked: true,
        ...(isPercent && { min: 0, max: 100 }),
        ...(yMin && { min: yMin }),
        ...(yMax && { max: yMax }),
      },
      x: {
        display: false,

        stacked: true,
      },
    },
  };

  return (
    <Bar
      {...(isMobile && { height: 200 })}
      responsive
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
