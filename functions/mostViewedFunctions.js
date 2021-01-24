const { getDates } = require('../dateFetching/getDates');
const { getMonthsRange } = require('../dateFetching/getMonthsRange');
const { listQuarters } = require('../dateFetching/getQuarters');

module.exports.mostViewedDaily = (mostViewArrayDaily, inputVal) => {
  const mostViewDailyResult = {}; // to form the daily report with date as key and value as n pages in array
  const dates = getDates(new Date(inputVal.startDate), new Date(inputVal.endDate));
  dates.map((date) => {
    mostViewDailyResult[`${date}`] = []; // inserting date key in object with empty array as value
    return date;
  });
  mostViewArrayDaily.map((mostView) => mostViewDailyResult[`${mostView.date}`].push({ location: mostView.location, viewCount: mostView.viewCount }));
  Object.entries(mostViewDailyResult).map((dailyReport) => { // sorting and splicing based on no. of page user requested
    mostViewDailyResult[`${dailyReport[0]}`] = mostViewDailyResult[`${dailyReport[0]}`].sort((val1, val2) => ((val1.viewCount < val2.viewCount) ? 1 : -1));
    mostViewDailyResult[`${dailyReport[0]}`] = mostViewDailyResult[`${dailyReport[0]}`].length < inputVal.noOfPages
      ? mostViewDailyResult[`${dailyReport[0]}`] : mostViewDailyResult[`${dailyReport[0]}`].splice(0, inputVal.noOfPages);
    return dailyReport;
  });

  return mostViewDailyResult;
};

module.exports.mostViewedMonthly = (mostViewArrayDaily, inputVal) => {
  const mostViewMonthlyResult = {};
  const months = getMonthsRange(inputVal.startDate, inputVal.endDate);
  months.map((month) => {
    mostViewMonthlyResult[`${month}`] = []; // inserting month key in object with empty array as value
  });
  mostViewArrayDaily.map((mostView) => {
    Object.keys(mostViewMonthlyResult).map((key) => {
      if (mostView.date.includes(key)) {
          mostViewMonthlyResult[key].length === 0 ?
          mostViewMonthlyResult[key].push({ location: mostView.location, viewCount: mostView.viewCount }) 
          : ( mostViewMonthlyResult[key].map(mostViewMonthly => mostViewMonthly.location).includes(mostView.location) ?
              mostViewMonthlyResult[key] = mostViewMonthlyResult[key].map(mostViewMonthly => 
                  mostViewMonthly.location === mostView.location ? {...mostViewMonthly, viewCount: mostViewMonthly.viewCount+mostView.viewCount} : mostViewMonthly)
              : mostViewMonthlyResult[key].push({ location: mostView.location, viewCount: mostView.viewCount }) 
            )      
      }
      return key;
    });
    return mostView;
  });

  Object.entries(mostViewMonthlyResult).map((monthlyReport) => { // sorting and splicing based on no. of page user requested
    mostViewMonthlyResult[`${monthlyReport[0]}`] = mostViewMonthlyResult[`${monthlyReport[0]}`].sort((val1, val2) => ((val1.viewCount < val2.viewCount) ? 1 : -1));
    mostViewMonthlyResult[`${monthlyReport[0]}`] = mostViewMonthlyResult[`${monthlyReport[0]}`].length < inputVal.noOfPages
      ? mostViewMonthlyResult[`${monthlyReport[0]}`] : mostViewMonthlyResult[`${monthlyReport[0]}`].splice(0, inputVal.noOfPages);
  });

  return mostViewMonthlyResult;
};

module.exports.mostViewedQuarterly = (mostViewArrayDaily, inputVal) => {
  const mostViewQuarterlyResult = {};
  const quarters = listQuarters(new Date(inputVal.startDate), new Date(inputVal.endDate));
  quarters.map((quarter) => {
    mostViewQuarterlyResult[`${quarter}`] = []; // inserting quarter key in object with empty array as value
    return quarters;
  });
  mostViewArrayDaily.map((mostView) => {
    Object.keys(mostViewQuarterlyResult).map((key) => {
      if (mostView.date.split('-')[0] === key.split('-')[1]) {
        if (key.split('-')[0] === 'Q1' && mostView.date.split('-')[1] === '01' || '02' || '03') {
          if(mostViewQuarterlyResult[key].length === 0) {
            mostViewQuarterlyResult[key] = [...mostViewQuarterlyResult[key], { location: mostView.location, viewCount: mostView.viewCount }];
          } else {
            mostViewQuarterlyResult[key].map(mostViewQuarterly => mostViewQuarterly.location).includes(mostView.location) ?
              mostViewQuarterlyResult[key] = mostViewQuarterlyResult[key].map(mostViewQuarterly => 
                mostViewQuarterly.location === mostView.location ? {...mostViewQuarterly, viewCount: mostViewQuarterly.viewCount+mostView.viewCount} 
                : mostViewQuarterly
              ) 
              : mostViewQuarterlyResult[key] = [...mostViewQuarterlyResult[key], { location: mostView.location, viewCount: mostView.viewCount }];
          }
        } else if (key.split('-')[0] === 'Q2' && mostView.date.split('-')[1] === '04' || '05' || '06') {
            if(mostViewQuarterlyResult[key].length === 0) {
              mostViewQuarterlyResult[key] = [...mostViewQuarterlyResult[key], { location: mostView.location, viewCount: mostView.viewCount }];
            } else {
              mostViewQuarterlyResult[key].map(mostViewQuarterly => mostViewQuarterly.location).includes(mostView.location) ?
                mostViewQuarterlyResult[key] = mostViewQuarterlyResult[key].map(mostViewQuarterly => 
                  mostViewQuarterly.location === mostView.location ? {...mostViewQuarterly, viewCount: mostViewQuarterly.viewCount+mostView.viewCount} 
                  : mostViewQuarterly
                ) 
                : mostViewQuarterlyResult[key] = [...mostViewQuarterlyResult[key], { location: mostView.location, viewCount: mostView.viewCount }];
            }
        } else if (key.split('-')[0] === 'Q3' && mostView.date.split('-')[1] === '07' || '08' || '09') {
          if(mostViewQuarterlyResult[key].length === 0) {
            mostViewQuarterlyResult[key] = [...mostViewQuarterlyResult[key], { location: mostView.location, viewCount: mostView.viewCount }];
          } else {
            mostViewQuarterlyResult[key].map(mostViewQuarterly => mostViewQuarterly.location).includes(mostView.location) ?
              mostViewQuarterlyResult[key] = mostViewQuarterlyResult[key].map(mostViewQuarterly => 
                mostViewQuarterly.location === mostView.location ? {...mostViewQuarterly, viewCount: mostViewQuarterly.viewCount+mostView.viewCount} 
                : mostViewQuarterly
              ) 
              : mostViewQuarterlyResult[key] = [...mostViewQuarterlyResult[key], { location: mostView.location, viewCount: mostView.viewCount }];
          }
        } else if (key.split('-')[0] === 'Q4' && mostView.date.split('-')[1] === '10' || '11' || '12') {
          if(mostViewQuarterlyResult[key].length === 0) {
            mostViewQuarterlyResult[key] = [...mostViewQuarterlyResult[key], { location: mostView.location, viewCount: mostView.viewCount }];
          } else {
            mostViewQuarterlyResult[key].map(mostViewQuarterly => mostViewQuarterly.location).includes(mostView.location) ?
              mostViewQuarterlyResult[key] = mostViewQuarterlyResult[key].map(mostViewQuarterly => 
                mostViewQuarterly.location === mostView.location ? {...mostViewQuarterly, viewCount: mostViewQuarterly.viewCount+mostView.viewCount} 
                : mostViewQuarterly
              ) 
              : mostViewQuarterlyResult[key] = [...mostViewQuarterlyResult[key], { location: mostView.location, viewCount: mostView.viewCount }];
          }
        }
      }
      return key;
    });
    return mostView;
  });

  Object.entries(mostViewQuarterlyResult).map((quarterlyReport) => { // sorting and splicing based on no. of page user requested
    mostViewQuarterlyResult[`${quarterlyReport[0]}`] = mostViewQuarterlyResult[`${quarterlyReport[0]}`].sort((val1, val2) => ((val1.viewCount < val2.viewCount) ? 1 : -1));
    mostViewQuarterlyResult[`${quarterlyReport[0]}`] = mostViewQuarterlyResult[`${quarterlyReport[0]}`].length < inputVal.noOfPages
      ? mostViewQuarterlyResult[`${quarterlyReport[0]}`] : mostViewQuarterlyResult[`${quarterlyReport[0]}`].splice(0, inputVal.noOfPages);
    return quarterlyReport;
  });

  return mostViewQuarterlyResult;
};
