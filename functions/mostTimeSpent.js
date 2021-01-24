const csv = require('csv');
const fs = require('fs');
const { mostTimeSpentDaily } = require('./mostTimeSpentFunctions');
const { mostTimeSpentMonthy } = require('./mostTimeSpentFunctions');

const { parse } = csv;
const readStream = fs.createReadStream(`${process.cwd()}/events.tsv`)
  .pipe(parse({ skip_lines_with_error: true, delimiter: '\t' }));

module.exports.mostTimeSpent = (inputVal) => new Promise((resolve, reject) => {
  const time = new Date().getTime();
  let row = 0;
  let dateIndex = 0;
  let locationIndex = 0;
  let eventValueIndex = 0;
  let mostTimeArrayDaily = [];

  readStream
    .on('data', (rowVal) => {
      if (row === 0) {
        dateIndex = rowVal.indexOf('date');
        locationIndex = rowVal.indexOf('location');
        eventValueIndex = rowVal.indexOf('event_value');
      } else if (new Date(inputVal.startDate).getTime() <= new Date(rowVal[dateIndex]).getTime() && new Date(inputVal.endDate).getTime() >= new Date(rowVal[dateIndex]).getTime()) {
        mostTimeArrayDaily = mostTimeArrayDaily.length === 0
          ? [...mostTimeArrayDaily, { location: rowVal[locationIndex], timeSpent: Number(rowVal[eventValueIndex]), date: rowVal[dateIndex] }]
          : (mostTimeArrayDaily.map((data) => data.date).includes(rowVal[dateIndex]) && mostTimeArrayDaily.map((data) => data.location).includes(rowVal[locationIndex])
            ? mostTimeArrayDaily.map((timeSpentData) => (timeSpentData.location === rowVal[locationIndex] ? { ...timeSpentData, timeSpent: timeSpentData.timeSpent + Number(rowVal[eventValueIndex]) } : timeSpentData))
            : [...mostTimeArrayDaily, { location: rowVal[locationIndex], timeSpent: Number(rowVal[eventValueIndex]), date: rowVal[dateIndex] }]
          );
      }
      row += 1;
    });

  readStream
    .on('error', (err) => {
      reject(err);
    });

  readStream
    .on('end', () => {
      if (inputVal.reportType === 'monthly') { // for monthly report
        const mostTimeSpentMonthlyResult = mostTimeSpentMonthy(mostTimeArrayDaily, inputVal);
        resolve({ mostTimeSpent: mostTimeSpentMonthlyResult, time: new Date().getTime() - time });
      } else if (inputVal.reportType === 'quarterly') { // for quarterly report
        const mostTimeSpentQuarterlyResult = mostTimeSpentQuarterly(mostTimeArrayDaily, inputVal);
        resolve({ mostTimeSpent: mostTimeSpentQuarterlyResult, time: new Date().getTime() - time });
      } else { // for daily report
        const mostTimeSpentDailyResult = mostTimeSpentDaily(mostTimeArrayDaily, inputVal);
        resolve({ mostTimeSpent: mostTimeSpentDailyResult, time: new Date().getTime() - time });
      }
    });
});
