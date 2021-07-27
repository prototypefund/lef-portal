import { Bar } from "react-chartjs-2";

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      display: false,
    },
    x: {
      title: "Jahr",
      ticks: {
        /*        callback: (value, index, values) => {
          return index % 5 === 0 ? value : "";
        },*/
      },
    },
  },
};

const WARMING_COLORS = [
  "#08306b",
  "#08519c",
  "#2171b5",
  "#4292c6",
  "#6baed6",
  "#9ecae1",
  "#c6dbef",
  "#deebf7",
  "#fee0d2",
  "#fcbba1",
  "#fc9272",
  "#fb6a4a",
  "#ef3b2c",
  "#cb181d",
  "#a50f15",
  "#67000d",
];

const YEAR_RANGE = [1950, 2021];
const REFERENCE_RANGE = [1961, 1990];

export const WarmingStripe = ({ climateData = [] }) => {
  let yearlyMeans = [];
  climateData.forEach((climateDataEntry) => {
    const { monthlyData = [], year } = climateDataEntry;
    const monthlyMeans = monthlyData.map((m) => m.temperatureMean);
    const yearMean = monthlyMeans.reduce((a, b) => a + b, 0) / 12;
    yearlyMeans.push({ mean: yearMean, year });
  });
  const referenceData = yearlyMeans.filter(
    (entry) =>
      entry.year > REFERENCE_RANGE[0] && entry.year < REFERENCE_RANGE[1]
  );
  const referenceMean =
    referenceData.map((d) => d.mean).reduce((a, b) => a + b, 0) /
    referenceData.length;

  yearlyMeans = yearlyMeans.filter(
    (entry) => entry.year >= YEAR_RANGE[0] && entry.year <= YEAR_RANGE[1]
  );

  const data = {
    labels: yearlyMeans.map((entry) => entry.year),
    datasets: [
      {
        label: "Mean",
        data: [...Array(100).keys()].map(() => 100),
        backgroundColor: yearlyMeans.map((entry) => {
          const temperature = entry.mean;
          const difference = temperature - referenceMean;
          const middleIndex = Math.round(WARMING_COLORS.length / 2);
          const index = Math.round(middleIndex + difference);
          return WARMING_COLORS[index];
        }),
      },
    ],
  };

  console.debug(data);

  return (
    <>
      <Bar data={data} options={options} />
    </>
  );
};
