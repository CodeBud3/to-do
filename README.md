# to-do

Backend setup

Response Object

```
{
    "success": false,
    "message": "Validation error",
    "data": undefined
    "error": [
        {
            "validation": "email",
            "code": "invalid_string",
            "message": "Invalid email address",
            "path": [
                "body",
                "email"
            ]
        },
        {
            "code": "too_small",
            "minimum": 6,
            "type": "string",
            "inclusive": true,
            "exact": false,
            "message": "Password must be at least 6 characters long",
            "path": [
                "body",
                "password"
            ]
        }
    ]
}
```
