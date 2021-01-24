# Events API 

### Request http://localhost:3000/events  (POST)

### Request body :
{
    "uuid": "40e6215d-b5c6",
    "tstamp": "2018-02-02 13:28:20",
    "source": "abc",
    "event_type": "event",
    "event_category": "view",
    "event_action": "view",
    "event_label": "/abc/asc",
    "event_value": 2,
    "location": "/abc/asc"
}

### Response :

{
    "status": "Successful",
    "result": {
        "uuid": "40e6215d-b5c6",
        "tstamp": "2018-02-02T13:28:20.000Z",
        "source": "abc",
        "date": "2021-01-16T00:00:00.000Z",
        "event_type": "event",
        "event_category": "view",
        "event_action": "view",
        "event_label": "/abc/asc",
        "event_value": 2,
        "created_at": "2021-01-16T10:49:35.454Z",
        "last_updated_at": "2021-01-16T10:49:35.454Z",
        "location": "/abc/asc",
        "id": 1
    }
}