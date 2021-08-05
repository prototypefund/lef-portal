export const getRandomId = () => "_" + Math.random().toString(36).substr(2, 9);

export const aggregateByYear = (climateData = []) => {
  let yearlyMeans = [];
  climateData.forEach((climateDataEntry) => {
    const { monthlyData = [], year } = climateDataEntry;
    const monthlyMeans = monthlyData.map((m) => m.temperatureMean);
    const monthlyRainfallMeans = monthlyData.map((m) => m.rainfall);
    const yearMean =
      monthlyMeans.reduce((a, b) => a + b, 0) / monthlyMeans.length;
    const yearRainfallMean =
      monthlyRainfallMeans.reduce((a, b) => a + b, 0) /
      monthlyRainfallMeans.length;
    yearlyMeans.push({ mean: yearMean, year, rainfallMean: yearRainfallMean });
  });
  return yearlyMeans;
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

export const isValidClimateValue = (value) => [-999, null].includes(value);

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
