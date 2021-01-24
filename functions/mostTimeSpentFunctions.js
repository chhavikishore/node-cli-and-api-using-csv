const { getDates } = require('../dateFetching/getDates');
const { getMonthsRange } = require('../dateFetching/getMonthsRange');
const { listQuarters } = require('../dateFetching/getQuarters');

module.exports.mostTimeSpentDaily = (mostTimeArrayDaily, inputVal) => {
  const mostTimeSpentDailyResult = {}; // to form the daily report with date as key and value as n pages in array
  const dates = getDates(new Date(inputVal.startDate), new Date(inputVal.endDate));
  dates.map((date) => {
    mostTimeSpentDailyResult[`${date}`] = []; // inserting date key in object with empty array as value
    return date;
  });
  mostTimeArrayDaily.map((mostTimeData) => mostTimeSpentDailyResult[`${mostTimeData.date}`].push({ location: mostTimeData.location, timeSpent: mostTimeData.timeSpent }));
  Object.entries(mostTimeSpentDailyResult).map((dailyReport) => { // sorting and splicing based on no. of page user requested
    mostTimeSpentDailyResult[`${dailyReport[0]}`] = mostTimeSpentDailyResult[`${dailyReport[0]}`].sort((val1, val2) => ((val1.timeSpent < val2.timeSpent) ? 1 : -1));
    mostTimeSpentDailyResult[`${dailyReport[0]}`] = mostTimeSpentDailyResult[`${dailyReport[0]}`].length < inputVal.noOfPages
      ? mostTimeSpentDailyResult[`${dailyReport[0]}`] : mostTimeSpentDailyResult[`${dailyReport[0]}`].splice(0, inputVal.noOfPages);
    return dailyReport;
  });

  return mostTimeSpentDailyResult;
};

module.exports.mostTimeSpentMonthy = (mostTimeArrayDaily, inputVal) => {
  const mostTimeSpentMonthlyResult = {};
  const months = getMonthsRange(inputVal.startDate, inputVal.endDate);
  months.map((month) => {
    mostTimeSpentMonthlyResult[`${month}`] = []; // inserting month key in object with empty array as value
    return months;
  });
  mostTimeArrayDaily.map((mostTime) => {
    Object.keys(mostTimeSpentMonthlyResult).map((key) => {
      if (mostTime.date.includes(key)) {
        mostTimeSpentMonthlyResult[key].length === 0 ?
        mostTimeSpentMonthlyResult[key].push({ location: mostTime.location, timeSpent: mostTime.timeSpent }) 
        : ( mostTimeSpentMonthlyResult[key].map(mostTimeSpentMonthly => mostTimeSpentMonthly.location).includes(mostTime.location) ?
            mostTimeSpentMonthlyResult[key] = mostTimeSpentMonthlyResult[key].map(mostTimeSpentMonthly => 
                mostTimeSpentMonthly.location === mostTime.location ? {...mostTimeSpentMonthly, timeSpent: mostTimeSpentMonthly.timeSpent+mostTime.timeSpent} : mostTimeSpentMonthly)
            : mostTimeSpentMonthlyResult[key].push({ location: mostTime.location, timeSpent: mostTime.timeSpent }) 
          )      
      }
      return key;
    });
    return mostTime;
  });

  Object.entries(mostTimeSpentMonthlyResult).map((monthlyReport) => { // sorting and splicing based on no. of page user requested
    mostTimeSpentMonthlyResult[`${monthlyReport[0]}`] = mostTimeSpentMonthlyResult[`${monthlyReport[0]}`].sort((val1, val2) => ((val1.timeSpent < val2.timeSpent) ? 1 : -1));
    mostTimeSpentMonthlyResult[`${monthlyReport[0]}`] = mostTimeSpentMonthlyResult[`${monthlyReport[0]}`].length < inputVal.noOfPages
      ? mostTimeSpentMonthlyResult[`${monthlyReport[0]}`] : mostTimeSpentMonthlyResult[`${monthlyReport[0]}`].splice(0, inputVal.noOfPages);
  });

  return mostTimeSpentMonthlyResult;
};

module.exports.mostTimeSpentQuarterly = (mostTimeArrayDaily, inputVal) => {
  const mostTimeSpentQuarterlyResult = {};
  const quarters = listQuarters(new Date(inputVal.startDate), new Date(inputVal.endDate));
  quarters.map((quarter) => {
    mostTimeSpentQuarterlyResult[`${quarter}`] = []; // inserting quarter key in object with empty array as value
    return quarters;
  });
  mostTimeArrayDaily.map((mostTimeData) => {
    Object.keys(mostTimeSpentQuarterlyResult).map((key) => {
      if (mostTimeData.date.split('-')[0] === key.split('-')[1]) {
        if (key.split('-')[0] === 'Q1' && mostTimeData.date.split('-')[1] === '01' || '02' || '03') {
          if(mostTimeSpentQuarterlyResult[key].length === 0) {
            mostTimeSpentQuarterlyResult[key] = [...mostTimeSpentQuarterlyResult[key], { location: mostTimeData.location, timeSpent: mostTimeData.timeSpent }];
          } else {
            mostTimeSpentQuarterlyResult[key].map(mostTimeSpentQuarterly => mostTimeSpentQuarterly.location).includes(mostTimeData.location) ?
              mostTimeSpentQuarterlyResult[key] = mostTimeSpentQuarterlyResult[key].map(mostTimeSpentQuarterly => 
                mostTimeSpentQuarterly.location === mostTimeData.location ? {...mostTimeSpentQuarterly, timeSpent: mostTimeSpentQuarterly.timeSpent+mostTimeData.timeSpent} 
                : mostTimeSpentQuarterly
              ) 
              : mostTimeSpentQuarterlyResult[key] = [...mostTimeSpentQuarterlyResult[key], { location: mostTimeData.location, timeSpent: mostTimeData.timeSpent }];
          }
        } else if (key.split('-')[0] === 'Q2' && mostTimeData.date.split('-')[1] === '04' || '05' || '06') {
          if(mostTimeSpentQuarterlyResult[key].length === 0) {
            mostTimeSpentQuarterlyResult[key] = [...mostTimeSpentQuarterlyResult[key], { location: mostTimeData.location, timeSpent: mostTimeData.timeSpent }];
          } else {
            mostTimeSpentQuarterlyResult[key].map(mostTimeSpentQuarterly => mostTimeSpentQuarterly.location).includes(mostTimeData.location) ?
              mostTimeSpentQuarterlyResult[key] = mostTimeSpentQuarterlyResult[key].map(mostTimeSpentQuarterly => 
                mostTimeSpentQuarterly.location === mostTimeData.location ? {...mostTimeSpentQuarterly, timeSpent: mostTimeSpentQuarterly.timeSpent+mostTimeData.timeSpent} 
                : mostTimeSpentQuarterly
              ) 
              : mostTimeSpentQuarterlyResult[key] = [...mostTimeSpentQuarterlyResult[key], { location: mostTimeData.location, timeSpent: mostTimeData.timeSpent }];
          }        
        } else if (key.split('-')[0] === 'Q3' && mostTimeData.date.split('-')[1] === '07' || '08' || '09') {
          if(mostTimeSpentQuarterlyResult[key].length === 0) {
            mostTimeSpentQuarterlyResult[key] = [...mostTimeSpentQuarterlyResult[key], { location: mostTimeData.location, timeSpent: mostTimeData.timeSpent }];
          } else {
            mostTimeSpentQuarterlyResult[key].map(mostTimeSpentQuarterly => mostTimeSpentQuarterly.location).includes(mostTimeData.location) ?
              mostTimeSpentQuarterlyResult[key] = mostTimeSpentQuarterlyResult[key].map(mostTimeSpentQuarterly => 
                mostTimeSpentQuarterly.location === mostTimeData.location ? {...mostTimeSpentQuarterly, timeSpent: mostTimeSpentQuarterly.timeSpent+mostTimeData.timeSpent} 
                : mostTimeSpentQuarterly
              ) 
              : mostTimeSpentQuarterlyResult[key] = [...mostTimeSpentQuarterlyResult[key], { location: mostTimeData.location, timeSpent: mostTimeData.timeSpent }];
          }        
        } else if (key.split('-')[0] === 'Q4' && mostTimeData.date.split('-')[1] === '10' || '11' || '12') {
          if(mostTimeSpentQuarterlyResult[key].length === 0) {
            mostTimeSpentQuarterlyResult[key] = [...mostTimeSpentQuarterlyResult[key], { location: mostTimeData.location, timeSpent: mostTimeData.timeSpent }];
          } else {
            mostTimeSpentQuarterlyResult[key].map(mostTimeSpentQuarterly => mostTimeSpentQuarterly.location).includes(mostTimeData.location) ?
              mostTimeSpentQuarterlyResult[key] = mostTimeSpentQuarterlyResult[key].map(mostTimeSpentQuarterly => 
                mostTimeSpentQuarterly.location === mostTimeData.location ? {...mostTimeSpentQuarterly, timeSpent: mostTimeSpentQuarterly.timeSpent+mostTimeData.timeSpent} 
                : mostTimeSpentQuarterly
              ) 
              : mostTimeSpentQuarterlyResult[key] = [...mostTimeSpentQuarterlyResult[key], { location: mostTimeData.location, timeSpent: mostTimeData.timeSpent }];
          }
        }
      }
      return key;
    });
    return mostTimeData;
  });

  Object.entries(mostTimeSpentQuarterlyResult).map((quarterlyReport) => { // sorting and splicing based on no. of page user requested
    mostTimeSpentQuarterlyResult[`${quarterlyReport[0]}`] = mostTimeSpentQuarterlyResult[`${quarterlyReport[0]}`].sort((val1, val2) => ((val1.timeSpent < val2.timeSpent) ? 1 : -1));
    mostTimeSpentQuarterlyResult[`${quarterlyReport[0]}`] = mostTimeSpentQuarterlyResult[`${quarterlyReport[0]}`].length < inputVal.noOfPages
      ? mostTimeSpentQuarterlyResult[`${quarterlyReport[0]}`] : mostTimeSpentQuarterlyResult[`${quarterlyReport[0]}`].splice(0, inputVal.noOfPages);
    return quarterlyReport;
  });

  return mostTimeSpentQuarterlyResult;
};
