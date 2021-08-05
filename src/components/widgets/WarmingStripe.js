import { Bar } from "react-chartjs-2";
import { aggregateByYear, mapToScale, mean, roundToN } from "../../utils/utils";

const options = (weatherStationName, dataset = [], referenceMean) => ({
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const { dataIndex } = context;
          let value = dataset[dataIndex];
          return value
            ? `Durchschnittstemperatur: ${roundToN(value, 2)}° Celsius`
            : "";
        },
      },
    },
    title: {
      text: `WarmingStripes für ${weatherStationName}`,
      display: true,
      position: "bottom",
    },
  },
  layout: {
    padding: 0,
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
});

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
const REFERENCE_RANGE = [1961, 1990];
const YEAR_RANGE = [REFERENCE_RANGE[0], new Date().getFullYear()];
const DEVIATION = 2.5;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const WarmingStripe = ({ climateData = [], weatherStationName }) => {
  let yearlyData = aggregateByYear(climateData);

  const years = yearlyData.map((y) => y.year);
  const startYear = Math.min(...years);
  const endYear = Math.max(...years);
  if (startYear > REFERENCE_RANGE[0] || endYear < REFERENCE_RANGE[1] + 10) {
    return (
      <p className={"alert alert-light"}>
        Für die Darstellung von WarmingStripes stehen leider zu wenig Daten zur
        Verfügung.{" "}
      </p>
    );
  }
  let displayData = yearlyData.filter(
    (y) => y.year >= YEAR_RANGE[0] && y.year <= YEAR_RANGE[1]
  );
  const referenceData = yearlyData.filter(
    (entry) =>
      entry.year > REFERENCE_RANGE[0] && entry.year < REFERENCE_RANGE[1]
  );
  const referenceMean = mean(referenceData.map((d) => d.mean));
  const maxColorValue = referenceMean + DEVIATION;
  const minColorValue = referenceMean - DEVIATION;

  const displayDataMeans = displayData.map((y) => y.mean);

  const data = {
    labels: displayData.map((y) => y.year),
    datasets: [
      {
        data: [...Array(100).keys()].map(() => 100),
        barPercentage: 1,
        categoryPercentage: 1,
        backgroundColor: displayDataMeans.map((temperature) => {
          const index = Math.round(
            mapToScale(
              clamp(temperature, minColorValue, maxColorValue),
              minColorValue,
              maxColorValue,
              0,
              WARMING_COLORS.length - 1
            )
          );
          return WARMING_COLORS[index];
        }),
      },
    ],
  };

  return (
    <>
      <Bar
        data={data}
        options={options(weatherStationName, displayDataMeans, referenceMean)}
        type={"bar"}
      />
      <p>{`In ${weatherStationName} betrug die Durchschnittstemperatur im Zeitraum zwischen 1961 und 1990 etwa ${roundToN(
        referenceMean,
        2
      )}° Celsius.`}</p>
    </>
  );
};
