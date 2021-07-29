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

const mapToScale = (value, oldMin, oldMax, newMin, newMax) => {
  const percent = (value - oldMin) / (oldMax - oldMin);
  return newMin + percent * (newMax - newMin);
};

const YEAR_RANGE = [1950, 2021];
const REFERENCE_RANGE = [1961, 1990];

export const WarmingStripe = ({ climateData = [] }) => {
  let yearlyMeans = [];
  climateData.forEach((climateDataEntry) => {
    const { monthlyData = [], year } = climateDataEntry;
    const monthlyMeans = monthlyData.map((m) => m.temperatureMean);
    const yearMean =
      monthlyMeans.reduce((a, b) => a + b, 0) / monthlyMeans.length;
    yearlyMeans.push({ mean: yearMean, year });
  });

  yearlyMeans = yearlyMeans.filter(
    (y) => y.year >= YEAR_RANGE[0] && y.year <= YEAR_RANGE[1]
  );

  const min = Math.min(...yearlyMeans.map((y) => y.mean));
  const max = Math.max(...yearlyMeans.map((y) => y.mean));

  yearlyMeans = yearlyMeans.map((y) => ({
    ...y,
    mean: (y.mean - min) / (max - min),
  }));

  const referenceData = yearlyMeans.filter(
    (entry) =>
      entry.year > REFERENCE_RANGE[0] && entry.year < REFERENCE_RANGE[1]
  );
  const referenceMean =
    referenceData.map((d) => d.mean).reduce((a, b) => a + b, 0) /
    referenceData.length;
  const maxColorValue = referenceMean < 0.5 ? 1 : 2 * referenceMean;
  const minColorValue = referenceMean > 0.5 ? 0 : 2 * referenceMean - 1;
  // console.debug({ referenceMean, minColorValue, maxColorValue });

  const data = {
    labels: yearlyMeans.map((entry) => entry.year),
    datasets: [
      {
        data: [...Array(100).keys()].map(() => 100),
        // data: yearlyMeans.map((y) => y.mean),
        backgroundColor: yearlyMeans.map((entry) => {
          const temperature = entry.mean;

          const difference = temperature - referenceMean;
          const differenceConverted = mapToScale(
            difference,
            -1,
            1,
            minColorValue,
            maxColorValue
          );
          const index = Math.round(
            mapToScale(
              differenceConverted,
              minColorValue,
              maxColorValue,
              0,
              WARMING_COLORS.length - 1
            )
          );
          // console.debug({difference, differenceConverted, index});
          return WARMING_COLORS[index];
        }),
      },
    ],
  };

  return (
    <>
      <Bar data={data} options={options} />
    </>
  );
};
