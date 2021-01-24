const csv = require('csv');
const fs = require('fs');
const { mostViewedDaily } = require('./mostViewedFunctions');
const { mostViewedMonthly } = require('./mostViewedFunctions');
const { mostViewedQuarterly } = require('./mostViewedFunctions');

const { parse } = csv;
const readStream = fs.createReadStream(`${process.cwd()}/events.tsv`)
  .pipe(parse({ skip_lines_with_error: true, delimiter: '\t' }));

module.exports.mostViewed = (inputVal) => new Promise((resolve, reject) => {
  const time = new Date().getTime();
  let row = 0;
  let dateIndex = 0;
  let locationIndex = 0;
  let eventActionIndex = 0;
  let mostViewArrayDaily = [];

  readStream
    .on('data', (rowVal) => {
      if (row === 0) {
        dateIndex = rowVal.indexOf('date');
        locationIndex = rowVal.indexOf('location');
        eventActionIndex = rowVal.indexOf('event_action');
      } else if (rowVal[eventActionIndex] === 'view'
                  && new Date(inputVal.startDate).getTime() <= new Date(rowVal[dateIndex]).getTime()
                    && new Date(inputVal.endDate).getTime() >= new Date(rowVal[dateIndex]).getTime()) {
        mostViewArrayDaily = mostViewArrayDaily.length === 0
          ? [...mostViewArrayDaily, { location: rowVal[locationIndex], viewCount: 1, date: rowVal[dateIndex] }]
          : (mostViewArrayDaily.map((data) => data.date).includes(rowVal[dateIndex]) && mostViewArrayDaily.map((data) => data.location).includes(rowVal[locationIndex])
            ? mostViewArrayDaily.map((view) => (view.location === rowVal[locationIndex] ? { ...view, viewCount: view.viewCount + 1 } : view))
            : [...mostViewArrayDaily, { location: rowVal[locationIndex], viewCount: 1, date: rowVal[dateIndex] }]
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
        const mostViewMonthlyResult = mostViewedMonthly(mostViewArrayDaily, inputVal);
        resolve({ mostViewed: mostViewMonthlyResult, time: new Date().getTime() - time });
      } else if (inputVal.reportType === 'quarterly') { // for quarterly report
        const mostViewQuarterlyResult = mostViewedQuarterly(mostViewArrayDaily, inputVal);
        resolve({ mostViewed: mostViewQuarterlyResult, time: new Date().getTime() - time });
      } else { // for daily report
        const mostViewDailyResult = mostViewedDaily(mostViewArrayDaily, inputVal);
        resolve({ mostViewed: mostViewDailyResult, time: new Date().getTime() - time });
      }
    });
});
