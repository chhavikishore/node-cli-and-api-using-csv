# Active Users by time spent API request-response (orderBy and count are mandatory query params)
default startDate : '2001-01-01'
default endDate : '2020-01-01'
default reportType : daily

## Daily Data :

### Request : http://localhost:3000/reports/users?orderBy=timeSpent&count=3&startDate=2018-02-02&endDate=2018-02-02&reportType=daily 

### Response
{ 
    "2018-02-02": [
        {
            "uuid": "c088ea50de554ad5a7a8d8ff5139b45e",
            "timeSpent": 51642
        },
        {
            "uuid": "4d1a3d29f14e4a898ef9e7f31e9fd89a",
            "timeSpent": 35710
        },
        {
            "uuid": "4b166bcaf66d409483ee33b7b89542b6",
            "timeSpent": 27474
        }
    ]
}

## Monthly Data :

### Request : http://localhost:3000/reports/users?orderBy=timeSpent&count=3&startDate=2018-02-02&endDate=2018-02-02&reportType=monthly

### Response
{ 
    "2018-02": [
        {
            "uuid": "a088ea50de554ad5a7a8d8ff5139b45e",
            "timeSpent": 5164286
        },
        {
            "uuid": "6d1a3d29f14e4a898ef9e7f31e9fd89a",
            "timeSpent": 3571064
        },
        {
            "uuid": "3b166bcaf66d409483ee33b7b89542b6",
            "timeSpent": 2747481
        }
    ]
}

## Quarterly Data :

### Request : http://localhost:3000/reports/users?orderBy=timeSpent&count=3&startDate=2018-02-02&endDate=2018-02-02&reportType=quarterly 

### Response
{ 
    "Q1-2018": [
        {
            "uuid": "a088ea50de554ad5a7a8d8ff5139b45e",
            "timeSpent": 5164286
        },
        {
            "uuid": "6d1a3d29f14e4a898ef9e7f31e9fd89a",
            "timeSpent": 3571064
        },
        {
            "uuid": "3b166bcaf66d409483ee33b7b89542b6",
            "timeSpent": 2747481
        }
    ]
}