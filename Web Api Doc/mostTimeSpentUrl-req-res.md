# Most Time spent url API request-response (orderBy and count are mandatory query params)
default startDate : '2001-01-01'
default endDate : '2020-01-01'
default reportType : daily

## Daily Data :

### Request :  http://localhost:3000/reports/pages?orderBy=timeSpent&count=3&startDate=2018-02-02&endDate=2018-02-02&reportType=daily

### Response
{
    "2018-02": [
        {
            "location": "/",
            "timeSpent": 136842
        },
        {
            "location": "/m/495543f6-85d0-4c8d-818c-fec1d9fa47ea/",
            "timeSpent": 68094
        },
        {
            "location": "/m/fff9a0ea-10c3-45b8-a79d-37acd8802a4f/",
            "timeSpent": 30913
        }
    ]
}

## Monthly Data :

### Request : http://localhost:3000/reports/pages?orderBy=timeSpent&count=3&startDate=2018-02-02&endDate=2018-02-02&reportType=monthly

### Response
{
    "2018-02": [
        {
            "location": "/",
            "timeSpent": 136842
        },
        {
            "location": "/m/495543f6-85d0-4c8d-818c-fec1d9fa47ea/",
            "timeSpent": 68094
        },
        {
            "location": "/m/fff9a0ea-10c3-45b8-a79d-37acd8802a4f/",
            "timeSpent": 30913
        }
    ]
}

## Quarterly Data :

### Request :  http://localhost:3000/reports/pages?orderBy=timeSpent&count=3&startDate=2018-02-02&endDate=2018-02-02&reportType=quarterly

### Response
{
    "Q1-2018": [
        {
            "location": "/",
            "timeSpent": 136842
        },
        {
            "location": "/m/495543f6-85d0-4c8d-818c-fec1d9fa47ea/",
            "timeSpent": 68094
        },
        {
            "location": "/m/fff9a0ea-10c3-45b8-a79d-37acd8802a4f/",
            "timeSpent": 30913
        }
    ]
}