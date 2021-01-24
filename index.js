const inquirer = require('inquirer');
const { mostViewed } = require('./functions/mostViewed');
const { mostTimeSpent } = require('./functions/mostTimeSpent');
const { activeUserByTime } = require('./functions/activeUserByTime');
const logger = require('./logger/logger');

const queryExecutionOptions = [
  {
    type: 'input',
    name: 'query',
    message: `Menu for query Execution (on DAILY basis )::: 
                    \n 1. List top n pages that were viewed the most  
                    \n 2. List top n pages where most time was spent.
                    \n 3. List top n active users
                    \n Enter a value to execute the query : `,
  },
  {
    type: 'input',
    name: 'noOfPages',
    message: 'Enter number of pages you want to view - ',
  },
  {
    type: 'input',
    name: 'startDate',
    message: 'Enter Start Date (YYYY-MM-DD) - ',
  },
  {
    type: 'input',
    name: 'endDate',
    message: 'Enter End Date (YYYY-MM-DD) - ',
  },
  {
    type: 'input',
    name: 'reportType',
    message: `Menu for Report ::: (by default daily)
                    \n 1. daily basis  
                    \n 2. monthly
                    \n 3. quarterly
                    \n Enter a value to execute the query : `,
  },

];

inquirer.prompt(queryExecutionOptions).then((queryOptionAnswer) => {
  const reportType = queryOptionAnswer.reportType === '2' ? 'monthly' : queryOptionAnswer.reportType === '3' ? 'quarterly' : 'daily';
  const isValidStartDate = (Boolean(+new Date(queryOptionAnswer.startDate)) && 
                                new Date(queryOptionAnswer.startDate).getDate() === Number(queryOptionAnswer.startDate.split('-')[2]));
  const startDate = queryOptionAnswer.startDate && isValidStartDate ? queryOptionAnswer.startDate : '2001-01-01'; // setting default startDate if date is not present or invalid
  const isValidEndDate = (Boolean(+new Date(queryOptionAnswer.endDate)) &&
                                new Date(queryOptionAnswer.endDate).getDate() === Number(queryOptionAnswer.endDate.split('-')[2]));
  const endDate = queryOptionAnswer.endDate && isValidEndDate ? queryOptionAnswer.endDate : '2020-01-01'; // setting default endDate if date is not present or invalid
          
  queryOptionAnswer.query === '1' ? mostViewed({
    noOfPages: queryOptionAnswer.noOfPages, startDate, endDate, reportType,
  }).then((data) => console.log(JSON.stringify(data)))
    : queryOptionAnswer.query === '2' ? mostTimeSpent({
      noOfPages: queryOptionAnswer.noOfPages, startDate, endDate, reportType,
    }).then((data) => console.log(JSON.stringify(data)))
      : queryOptionAnswer.query === '3' ? activeUserByTime({
        noOfPages: queryOptionAnswer.noOfPages, startDate, endDate, reportType,
      }).then((data) => console.log(JSON.stringify(data)))
        : logger.error('You entered wrong value to query in the cli');
});
