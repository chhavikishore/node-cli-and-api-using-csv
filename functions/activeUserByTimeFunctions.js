const { getDates } = require('../dateFetching/getDates');
const { getMonthsRange } = require('../dateFetching/getMonthsRange');
const { listQuarters } = require('../dateFetching/getQuarters');

module.exports.activeUserByTimeDaily = (activeUserByTimeDaily, inputVal) => {
  const activeUserByTimeDailyResult = {}; // to form the daily report with date as key and value as n pages in array
  const dates = getDates(new Date(inputVal.startDate), new Date(inputVal.endDate));
  dates.map((date) => {
    activeUserByTimeDailyResult[`${date}`] = []; // inserting date key in object with empty array as value
    return date;
  });
  activeUserByTimeDaily.map((mostTimeData) => activeUserByTimeDailyResult[`${mostTimeData.date}`].push({ uuid: mostTimeData.uuid, timeSpent: mostTimeData.timeSpent }));
  Object.entries(activeUserByTimeDailyResult).map((dailyReport) => { // sorting and splicing based on no. of page user requested
    activeUserByTimeDailyResult[`${dailyReport[0]}`] = activeUserByTimeDailyResult[`${dailyReport[0]}`].sort((val1, val2) => ((val1.timeSpent < val2.timeSpent) ? 1 : -1));
    activeUserByTimeDailyResult[`${dailyReport[0]}`] = activeUserByTimeDailyResult[`${dailyReport[0]}`].length < inputVal.noOfPages
      ? activeUserByTimeDailyResult[`${dailyReport[0]}`] : activeUserByTimeDailyResult[`${dailyReport[0]}`].splice(0, inputVal.noOfPages);
    return dailyReport;
  });

  return activeUserByTimeDailyResult;
};

module.exports.activeUserByTimeMonthly = (activeUserByTimeDaily, inputVal) => {
  const activeUserByTimeMonthlyResult = {};
  const months = getMonthsRange(inputVal.startDate, inputVal.endDate);
  months.map((month) => {
    activeUserByTimeMonthlyResult[`${month}`] = []; // inserting month key in object with empty array as value
  });
  activeUserByTimeDaily.map((mostTimeData) => {
    Object.keys(activeUserByTimeMonthlyResult).map((key) => {
      if (mostTimeData.date.includes(key)) {
        activeUserByTimeMonthlyResult[key].length === 0 ?
          activeUserByTimeMonthlyResult[key].push({ uuid: mostTimeData.uuid, timeSpent: mostTimeData.timeSpent }) 
          : ( activeUserByTimeMonthlyResult[key].map(activeUserByTimeMonthly => activeUserByTimeMonthly.uuid).includes(mostTimeData.uuid) ?
              activeUserByTimeMonthlyResult[key] = activeUserByTimeMonthlyResult[key].map(activeUserByTimeMonthly => 
                  activeUserByTimeMonthly.uuid === mostTimeData.uuid ? {...activeUserByTimeMonthly, timeSpent: activeUserByTimeMonthly.timeSpent+mostTimeData.timeSpent} : activeUserByTimeMonthly)
              : activeUserByTimeMonthlyResult[key].push({ uuid: mostTimeData.uuid, timeSpent: mostTimeData.timeSpent }) 
            )
      }
      return key;
    });
    return mostTimeData;
  });

  Object.entries(activeUserByTimeMonthlyResult).map((monthlyReport) => { // sorting and splicing based on no. of page user requested
    activeUserByTimeMonthlyResult[`${monthlyReport[0]}`] = activeUserByTimeMonthlyResult[`${monthlyReport[0]}`].sort((val1, val2) => ((val1.timeSpent < val2.timeSpent) ? 1 : -1));
    activeUserByTimeMonthlyResult[`${monthlyReport[0]}`] = activeUserByTimeMonthlyResult[`${monthlyReport[0]}`].length < inputVal.noOfPages
      ? activeUserByTimeMonthlyResult[`${monthlyReport[0]}`] : activeUserByTimeMonthlyResult[`${monthlyReport[0]}`].splice(0, inputVal.noOfPages);
  });

  return activeUserByTimeMonthlyResult;
};

module.exports.activeUserByTimeQuarterly = (activeUserByTimeDaily, inputVal) => {
  const activeUserByTimeQuarterlyResult = {};
  const quarters = listQuarters(new Date(inputVal.startDate), new Date(inputVal.endDate));
  quarters.map((quarter) => {
    activeUserByTimeQuarterlyResult[`${quarter}`] = []; // inserting quarter key in object with empty array as value
    return quarters;
  });
  activeUserByTimeDaily.map((activeUsersData) => {
    Object.keys(activeUserByTimeQuarterlyResult).map((key) => {
      if (activeUsersData.date.split('-')[0] === key.split('-')[1]) {
        if (key.split('-')[0] === 'Q1' && activeUsersData.date.split('-')[1] === '01' || '02' || '03') {
          if(activeUserByTimeQuarterlyResult[key].length === 0) {
            activeUserByTimeQuarterlyResult[key] = [...activeUserByTimeQuarterlyResult[key], { uuid: activeUsersData.uuid, timeSpent: activeUsersData.timeSpent }];
          } else {
            activeUserByTimeQuarterlyResult[key].map(activeUserByTimeQuarterly => activeUserByTimeQuarterly.uuid).includes(activeUsersData.uuid) ?
              activeUserByTimeQuarterlyResult[key] = activeUserByTimeQuarterlyResult[key].map(activeUserByTimeQuarterly => 
                activeUserByTimeQuarterly.uuid === activeUsersData.uuid ? {...activeUserByTimeQuarterly, timeSpent: activeUserByTimeQuarterly.timeSpent+activeUsersData.timeSpent} 
                : activeUserByTimeQuarterly
              ) 
              : activeUserByTimeQuarterlyResult[key] = [...activeUserByTimeQuarterlyResult[key], { uuid: activeUsersData.uuid, timeSpent: activeUsersData.timeSpent }];
          }
        } else if (key.split('-')[0] === 'Q2' && activeUsersData.date.split('-')[1] === '04' || '05' || '06') {
          if(activeUserByTimeQuarterlyResult[key].length === 0) {
            activeUserByTimeQuarterlyResult[key] = [...activeUserByTimeQuarterlyResult[key], { uuid: activeUsersData.uuid, timeSpent: activeUsersData.timeSpent }];
          } else {
            activeUserByTimeQuarterlyResult[key].map(activeUserByTimeQuarterly => activeUserByTimeQuarterly.uuid).includes(activeUsersData.uuid) ?
              activeUserByTimeQuarterlyResult[key] = activeUserByTimeQuarterlyResult[key].map(activeUserByTimeQuarterly => 
                activeUserByTimeQuarterly.uuid === activeUsersData.uuid ? {...activeUserByTimeQuarterly, timeSpent: activeUserByTimeQuarterly.timeSpent+activeUsersData.timeSpent} 
                : activeUserByTimeQuarterly
              ) 
              : activeUserByTimeQuarterlyResult[key] = [...activeUserByTimeQuarterlyResult[key], { uuid: activeUsersData.uuid, timeSpent: activeUsersData.timeSpent }];
          }        
        } else if (key.split('-')[0] === 'Q3' && activeUsersData.date.split('-')[1] === '07' || '08' || '09') {
            if(activeUserByTimeQuarterlyResult[key].length === 0) {
              activeUserByTimeQuarterlyResult[key] = [...activeUserByTimeQuarterlyResult[key], { uuid: activeUsersData.uuid, timeSpent: activeUsersData.timeSpent }];
            } else {
              activeUserByTimeQuarterlyResult[key].map(activeUserByTimeQuarterly => activeUserByTimeQuarterly.uuid).includes(activeUsersData.uuid) ?
                activeUserByTimeQuarterlyResult[key] = activeUserByTimeQuarterlyResult[key].map(activeUserByTimeQuarterly => 
                  activeUserByTimeQuarterly.uuid === activeUsersData.uuid ? {...activeUserByTimeQuarterly, timeSpent: activeUserByTimeQuarterly.timeSpent+activeUsersData.timeSpent} 
                  : activeUserByTimeQuarterly
                ) 
                : activeUserByTimeQuarterlyResult[key] = [...activeUserByTimeQuarterlyResult[key], { uuid: activeUsersData.uuid, timeSpent: activeUsersData.timeSpent }];
            }        
          } else if (key.split('-')[0] === 'Q4' && activeUsersData.date.split('-')[1] === '10' || '11' || '12') {
            if(activeUserByTimeQuarterlyResult[key].length === 0) {
              activeUserByTimeQuarterlyResult[key] = [...activeUserByTimeQuarterlyResult[key], { uuid: activeUsersData.uuid, timeSpent: activeUsersData.timeSpent }];
            } else {
              activeUserByTimeQuarterlyResult[key].map(activeUserByTimeQuarterly => activeUserByTimeQuarterly.uuid).includes(activeUsersData.uuid) ?
                activeUserByTimeQuarterlyResult[key] = activeUserByTimeQuarterlyResult[key].map(activeUserByTimeQuarterly => 
                  activeUserByTimeQuarterly.uuid === activeUsersData.uuid ? {...activeUserByTimeQuarterly, timeSpent: activeUserByTimeQuarterly.timeSpent+activeUsersData.timeSpent} 
                  : activeUserByTimeQuarterly
                ) 
                : activeUserByTimeQuarterlyResult[key] = [...activeUserByTimeQuarterlyResult[key], { uuid: activeUsersData.uuid, timeSpent: activeUsersData.timeSpent }];
            }        
          }
      }
      return key;
    });
    return activeUsersData;
  });

  Object.entries(activeUserByTimeQuarterlyResult).map((quarterlyReport) => { // sorting and splicing based on no. of page user requested
    activeUserByTimeQuarterlyResult[`${quarterlyReport[0]}`] = activeUserByTimeQuarterlyResult[`${quarterlyReport[0]}`].sort((val1, val2) => ((val1.timeSpent < val2.timeSpent) ? 1 : -1));
    activeUserByTimeQuarterlyResult[`${quarterlyReport[0]}`] = activeUserByTimeQuarterlyResult[`${quarterlyReport[0]}`].length < inputVal.noOfPages
      ? activeUserByTimeQuarterlyResult[`${quarterlyReport[0]}`] : activeUserByTimeQuarterlyResult[`${quarterlyReport[0]}`].splice(0, inputVal.noOfPages);
    return quarterlyReport;
  });

  return activeUserByTimeQuarterlyResult;
};
