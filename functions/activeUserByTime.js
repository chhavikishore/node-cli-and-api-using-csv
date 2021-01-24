const csv = require('csv');
const fs = require('fs');
const { activeUserByTimeDaily } = require('./activeUserByTimeFunctions');
const { activeUserByTimeMonthly } = require('./activeUserByTimeFunctions');
const { activeUserByTimeQuarterly } = require('./activeUserByTimeFunctions');

const { parse } = csv;
const readStream = fs.createReadStream(`${process.cwd()}/events.tsv`)
  .pipe(parse({ skip_lines_with_error: true, delimiter: '\t' }));

module.exports.activeUserByTime = (inputVal) => new Promise((resolve, reject) => {
  const time = new Date().getTime();
  let row = 0;
  let dateIndex = 0;
  let eventActionIndex = 0;
  let eventValueIndex = 0;
  let uuidIndex = 0;
  let activeUserByTimeArrayDaily = [];

  readStream
    .on('data', (rowVal) => {
      if (row === 0) {
        uuidIndex = rowVal.indexOf('uuid');
        dateIndex = rowVal.indexOf('date');
        eventValueIndex = rowVal.indexOf('event_value');
        eventActionIndex = rowVal.indexOf('event_action');
      } else if (rowVal[eventActionIndex] === 'view' 
                  && new Date(inputVal.startDate).getTime() <= new Date(rowVal[dateIndex]).getTime() 
                  && new Date(inputVal.endDate).getTime() >= new Date(rowVal[dateIndex]).getTime()) 
      {
        activeUserByTimeArrayDaily = activeUserByTimeArrayDaily.length === 0
          ? [...activeUserByTimeArrayDaily, { uuid: rowVal[uuidIndex], timeSpent: Number(rowVal[eventValueIndex]), date: rowVal[dateIndex] }]
          : (activeUserByTimeArrayDaily.map((data) => data.date).includes(rowVal[dateIndex]) && activeUserByTimeArrayDaily.map((data) => data.uuid).includes(rowVal[uuidIndex])
            ? activeUserByTimeArrayDaily.map((timeSpentData) => (timeSpentData.uuid === rowVal[uuidIndex] ? { ...timeSpentData, timeSpent: timeSpentData.timeSpent + Number(rowVal[eventValueIndex]) } : timeSpentData))
            : [...activeUserByTimeArrayDaily, { uuid: rowVal[uuidIndex], timeSpent: Number(rowVal[eventValueIndex]), date: rowVal[dateIndex] }]
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
        const activeUserByTimeMonthlyResult = activeUserByTimeMonthly(activeUserByTimeArrayDaily, inputVal);
        resolve({ activeUsers: activeUserByTimeMonthlyResult, time: new Date().getTime() - time });
      } else if (inputVal.reportType === 'quarterly') { // for quarterly report
        const activeUserByTimeQuarterlyResult = activeUserByTimeQuarterly(activeUserByTimeArrayDaily, inputVal);
        resolve({ activeUsers: activeUserByTimeQuarterlyResult, time: new Date().getTime() - time });
      } else { // for daily report
        const activeUserByTimeDailyResult = activeUserByTimeDaily(activeUserByTimeArrayDaily, inputVal);
        resolve({ activeUsers: activeUserByTimeDailyResult, time: new Date().getTime() - time });
      }
    });
});
