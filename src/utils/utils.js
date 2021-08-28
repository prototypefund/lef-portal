import { isNumber } from "chart.js/helpers";

export const getRandomId = () => "_" + Math.random().toString(36).substr(2, 9);

export const calculateYearMeans = (monthlyDataConverted = {}) => {
  const dataArray = Object.keys(monthlyDataConverted).map(
    (key) => monthlyDataConverted[key]
  );
  const monthlyMeans = dataArray.map((m) => m.temperatureMean);
  const monthlyRainfallMeans = dataArray.map((m) => m.rainfall);
  const yearMean =
    monthlyMeans.reduce((a, b) => a + b, 0) / monthlyMeans.length;
  const yearRainfallMean =
    monthlyRainfallMeans.reduce((a, b) => a + b, 0) /
    monthlyRainfallMeans.length;
  return {
    mean: yearMean,
    rainfallMean: yearRainfallMean,
    invalidRainfalls:
      monthlyRainfallMeans.length !== 12 ||
      !dataArray.every((e) => !e.invalidRainfall),
    invalidMeans:
      monthlyMeans.length !== 12 || !dataArray.every((e) => !e.invalidMean),
  };
};

export const mergeWeatherStationData = (dataArray = []) => {
  let allClimateDataFlattened = (dataArray.every((e) =>
    Array.isArray(e.climateData)
  )
    ? dataArray.reduce(
        (a, b) => [
          ...a,
          ...b.climateData.map((e) => ({ ...e, source: b.weatherStation })),
        ],
        []
      )
    : []
  ).sort((a, b) => a.year - b.year);
  let climateDataDictionary = {};
  allClimateDataFlattened.forEach((entry) => {
    const { year, source, monthlyData = [] } = entry;
    const oldEntry = climateDataDictionary[year] || {};
    let { sources = [], monthlyDataConverted = {} } = oldEntry;
    const updatedSources = !sources.includes(source)
      ? [...sources, source]
      : [...sources];
    monthlyData.forEach((monthData) => {
      const { month, rainfall, temperatureMean } = monthData;
      const oldMonthData = monthlyDataConverted[month] || {};
      const {
        rainfall: rainfallOld,
        temperatureMean: temperatureMeanOld,
        invalidRainfall: oldInvalidRainfall,
        invalidMean: oldInvalidMean,
      } = oldMonthData;
      const count = updatedSources.length;
      monthlyDataConverted[month] = {
        ...oldMonthData,
        month,
        rainfall: movingAverage(rainfallOld, rainfall, count),
        temperatureMean: movingAverage(
          temperatureMeanOld,
          temperatureMean,
          count
        ),
        invalidRainfall: oldInvalidRainfall || !isValidClimateValue(rainfall),
        invalidMean: oldInvalidMean || !isValidClimateValue(temperatureMean),
        sourceCount: count,
      };
    });

    climateDataDictionary[year] = {
      ...oldEntry,
      sources: updatedSources,
      year,
      monthlyDataConverted: {
        ...monthlyDataConverted,
      },
      ...calculateYearMeans(monthlyDataConverted),
    };
  });
  console.debug(climateDataDictionary);
  return climateDataDictionary;
};

const movingAverage = (oldSum, newValue, count) => {
  let newVar = newValue
    ? count > 1
      ? ((count - 1) * oldSum + newValue) / count
      : newValue
    : oldSum;
  return newVar;
};

export const mapToScale = (value, oldMin, oldMax, newMin, newMax) => {
  const percent = (value - oldMin) / (oldMax - oldMin);
  return newMin + percent * (newMax - newMin);
};

export const normalize = (data) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return data.map((d) => mapToScale(d, min, max, 0, 1));
};

export const mean = (data) => data.reduce((a, b) => a + b, 0) / data.length;

export const roundToN = (value, n) =>
  Math.round(value * Math.pow(10, n)) / Math.pow(10, n);

export const isValidClimateValue = (value) =>
  isNumber(value) && ![-999, null].includes(value);

export const toZeroIfInvalid = (value) =>
  isValidClimateValue(value) ? value : 0;

export const getYYYYMMDD = (date) => {
  const dateObj = new Date(date);
  const mm = dateObj.getMonth() + 1;
  const dd = dateObj.getDate();

  return [
    dateObj.getFullYear(),
    (mm > 9 ? "" : "0") + mm,
    (dd > 9 ? "" : "0") + dd,
  ].join("-");
};

export const getSortedArray = (arr, key) => {
  let sortedArray = [...arr];
  sortedArray.sort((a, b) => (a[key] < b[key] ? -1 : 1));
  return sortedArray;
};

export const isArrayWithOneElement = (arr) =>
  Array.isArray(arr) && arr.length > 0;

export const removeSpaces = (str = "") => str.replace(/\s/g, "");

export const sortStrings = (a, b) => (a < b ? -1 : 1);
