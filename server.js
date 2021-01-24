const express = require('express');
const { authTokenMiddleware } = require('./middleWare/authTokenMiddleware');
const { timingMiddleware } = require('./middleWare/timingMiddleware');
const { mostViewed } = require('./functions/mostViewed');
const { mostTimeSpent } = require('./functions/mostTimeSpent');
const { activeUserByTime } = require('./functions/activeUserByTime');
const httpLogger = require('./middleWare/httpLogger');
const logger = require('./logger/logger');
const bodyParser = require('body-parser');
const pg = require('pg');
const pool = new pg.Pool({connectionString: process.env.DATABASE_URL});
const { createTableQuery } = require('./database/createEventsTable');

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(authTokenMiddleware); // authTokenMiddleware middleware
app.use(timingMiddleware); // timingMiddleware middleware
app.use(httpLogger); // httpLogger middleware

// accepts query params : 'orderBy', 'count', 'startDate', 'endDate', 'reportType'
// return most viewed url if orderBy = views and if no reportType is specified returns daily report
// return most time spent url if orderBy = timeSpent and if no reportType is specified returns daily report
app.get('/reports/pages', (req, res) => {
  try {
    if (Object.keys(req.query).length !== 0) {
      const acceptedQueryParams = ['orderBy', 'count', 'startDate', 'endDate', 'reportType'];
      const reqQueryParams = Object.keys(req.query);
      const checkQueryParam = reqQueryParams.map((rqParam) => (acceptedQueryParams.includes(rqParam) ? rqParam : null)).filter((data) => data);
      if (reqQueryParams.length === checkQueryParam.length) {
        if (req.query.orderBy && req.query.count) {
          const { orderBy } = req.query;
          const { count } = req.query;
          const isValidStartDate = (Boolean(+new Date(req.query.startDate)) && new Date(req.query.startDate).getDate() === Number(req.query.startDate.split('-')[2]));
          const startDate = req.query.startDate && isValidStartDate ? req.query.startDate : '2001-01-01'; // setting default startDate if date is not present or invalid
          const isValidEndDate = (Boolean(+new Date(req.query.endDate)) && new Date(req.query.endDate).getDate() === Number(req.query.endDate.split('-')[2]));
          const endDate = req.query.endDate && isValidEndDate ? req.query.endDate : '2020-01-01'; // setting default endDate if date is not present or invalid
          const reportType = req.query.reportType && ['daily','monthly','quarterly'].includes(req.query.reportType) ? req.query.reportType : 'daily'; // accepts 'daily', 'monthly' and 'quarterly'
          if (orderBy === 'views' && count !== 0) {
            mostViewed({
              noOfPages: count, startDate, endDate, reportType,
            }).then((data) => res.send(data.mostViewed));
          } else if (orderBy === 'timeSpent' && count !== 0) {
            mostTimeSpent({
              noOfPages: count, startDate, endDate, reportType,
            }).then((data) => res.send(data.mostTimeSpent));
          } else {
            logger.error(`Error in /reports/pages (statusCode-400) : Invalid query parameter value provided`);
            res.status(400).send('Invalid query parameter value provided');
          }
        } else {
          logger.error(`Error in /reports/pages (statusCode-400) : Required query parameters not provided`);
          res.status(400).send('Required query parameters not provided');
        }
      } else {
        logger.error(`Error in /reports/pages (statusCode-400) : Invalid query parameters provided`);
        res.status(400).send('Invalid query parameters provided');
      }
    } else {
      logger.error(`Error in /reports/pages (statusCode-400) : No query parameters provided`);
      res.status(400).send('No query parameters provided');
    }
  } catch (err) {
    logger.error(`Error in /reports/pages (statusCode-500) : ${err}`);
    res.status(500).send(err);
  }
});



// accepts query params : 'orderBy', 'count', 'startDate', 'endDate', 'reportType'
// return active users based on reportType, if no reportType is specified returns daily report
app.get('/reports/users', (req, res) => {
  try {
    if (Object.keys(req.query).length !== 0) {
      const acceptedQueryParams = ['orderBy', 'count', 'startDate', 'endDate', 'reportType'];
      const reqQueryParams = Object.keys(req.query);
      const checkQueryParam = reqQueryParams.map((rqParam) => (acceptedQueryParams.includes(rqParam) ? rqParam : null)).filter((data) => data);
      if (reqQueryParams.length === checkQueryParam.length) {
        if (req.query.orderBy && req.query.count) {
          const { orderBy } = req.query;
          const { count } = req.query;
          const isValidstartDate = (Boolean(+new Date(`${req.query.startDate}`)) && new Date(`${req.query.startDate}`).getDate() === Number(req.query.startDate.split('-')[2]));
          const startDate = req.query.startDate && isValidstartDate ? req.query.startDate : '2001-01-01'; // setting default startDate if date is not present or invalid
          const isValidendDate = (Boolean(+new Date(`${req.query.endDate}`)) && new Date(`${req.query.endDate}`).getDate() === Number(req.query.endDate.split('-')[2]));
          const endDate = req.query.endDate && isValidendDate ? req.query.endDate : '2020-01-01'; // setting default endDate if date is not present or invalid
          const reportType = req.query.reportType && ['daily','monthly','quarterly'].includes(req.query.reportType) ? req.query.reportType : 'daily'; // accepts 'daily', 'monthly' and 'quarterly'
          if (count !== 0 && orderBy === 'timeSpent') {
            activeUserByTime({
              noOfPages: count, startDate, endDate, reportType,
            }).then((data) => res.send(data.activeUsers));
          } else {
            logger.error(`Error in /reports/users (statusCode-400) : Invalid query parameter value provided`);
            res.status(400).send('Invalid query parameter value provided');
          }
        } else {
          logger.error(`Error in /reports/users (statusCode-400) : Required query parameters not provided`);
          res.status(400).send('Required query parameters not provided');
        }
      } else {
        logger.error(`Error in /reports/users (statusCode-400) : Invalid query parameters provided`);
        res.status(400).send('Invalid query parameters provided');
      }
    } else {
      logger.error(`Error in /reports/users (statusCode-400) : No query parameters provided`);
      res.status(400).send('No query parameters provided');
    }
  } catch (err) {
    logger.error(`Error in /reports/users : ${err}`);
    res.status(500).send(err);
  }
});


app.post('/events', (req, res) => {
    const data = {
       uuid: req.body.uuid,
       tstamp: req.body.tstamp,
       source: req.body.source,
       event_type: req.body.event_type,
       event_category: req.body.event_category,
       event_action: req.body.event_action,
       event_label: req.body.event_label,
       event_value: req.body.event_value,
       location: req.body.location,
    }
    const query = `INSERT INTO events(uuid, tstamp, source, event_type, event_category, event_action, event_label, event_value, location) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
    const values = [data.uuid, data.tstamp, data.source, data.event_type, data.event_category, data.event_action, data.event_label, data.event_value, data.location] 
    pool.query(query, values, (error, result) => {
        if (error) {
            res.status(400).json({error});
        }
        res.status(202).send({
            status: 'Successful',
            result: result.rows[0]
        });
    });
});


const server = app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
  const pool = new pg.Pool({connectionString: process.env.DATABASE_URL});
  pool.query(createTableQuery, (err, d) => {
    if (err) {
        logger.error(`Error creating table "events" in Postgres : ${err}`);
    }
  });
});
