function getQuarter(date) {
  return `Q${Math.ceil((date.getMonth() + 1) / 3)}-${date.getFullYear()}`;
}

module.exports.listQuarters = (startDate, endDate) => {
  // Ensure start is the earlier date;
  if (startDate > endDate) {
    const t = endDate;
    endDate = startDate;
    startDate = t;
  }

  // Copy input start date do don't affect original
  startDate = new Date(startDate);

  // Set to 2nd of month so adding months doesn't roll over
  // and not affected by daylight saving
  startDate.setDate(2);

  // Initialise result array with start quarter
  let startQ = getQuarter(startDate);
  const endQ = getQuarter(endDate);
  const result = [startQ];

  // List quarters from start to end
  while (startQ !== endQ) {
    startDate.setMonth(startDate.getMonth() + 3);
    startQ = getQuarter(startDate);
    result.push(startQ);
  }

  return result;
};
