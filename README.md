# ticker - documentation

## Important note

Before starting the app make sure to create a directory called `ticker_db` on the same level as the application folder. Inside that directory you need to create the following files:

1. `users.json`
containing an empty array

3. `emailVerification.json`
containing an empty array

3. `monitor.json`
holding a object:
```
{
    "regularLogins": 0,
    "createdAccounts": 0,
    "addNewChat": 0,
    "sentMessages": 0,
    "inviteByMail": 0,
    "confirmEmail": 0,
    "editPersonalData": 0,
    "updateUserSilent": 0,
    "deleteAccount": 0,
    "updateUser": 0,
    "searchUsers": 0,
    "totalLogins": 0,
    "quickLogins": 0,
    "getConnectedUsers": 0,
    "getChat": 0,
    "getUser": 0,
    "forgotPassword": 0
}
```

## Data Structure

### user

Example for one user. The database holds an array of users called `users.json`. When user data is passed to the client, the password won't be included.

```json
{
    "id": "user_1729339335675_WkRwJg1LijwL",
    "config": {
        "mode": "light",
        "language": 1,
        "notifications": true,
        "rememberMe": true,
        "fullscreen": false,
        "allowFindMe": true,
        "hue": "40",
        "autoUpdate": 900000
    },
    "active": [
        [1729011342912, "user_1729339335675_WkRwJg1LijwL", true]
    ],
    "firstName": [
        [1729011342912, "user_1729339335675_WkRwJg1LijwL", "Anne"]
    ],
    "lastName": [
        [1729011342912, "user_1729339335675_WkRwJg1LijwL", "Doe"]
    ],
    "userName": [
        [1729011342912, "user_1729339335675_WkRwJg1LijwL", ""]
    ],
    "email": [
        [1729011342912, "user_1729339335675_WkRwJg1LijwL", "ad@bb.com"]
    ],
    "phone": [
        [1729011342912, "user_1729339335675_WkRwJg1LijwL", "0123456789"]
    ],
    "profilePix": [],
    "about": ["An apple a day keeps Hector away"],
    "chatPartners": [
        "user_1729011342912_GBCSi6dQmXho",
        "user_1729339335676_yU8y2flu140S"
    ],
    "chats": [
        "chat_1729339335675_ymykp34msb0P",
        "chat_1730209733947_75sxLNxeAJPW"
    ],
    "password": [				// not included when passed to client
        [1729011342912, "user_1729339335675_WkRwJg1LijwL", "321321321"]
    ]
}
```



### connectedUsers

An array provided by the server when `getConnectedUsers` is called. It contains the relevant information for the client about their chat partners. The array is stored at the front end in a variable equally called `connectedUsers`

```javascript
connectedUsers = [
    {
    "id": "user_1729339335676_yU8y2flu140S",
    "firstName": "John",
    "lastName": "Doe",
    "userName": "jeydee",
    "profilePix": [],
    "about": [
      "Grüne Tomaten"
    ],
    "hue": "40"
  }
]
```



### chats

Each chat is stored in the data base as a separate file. Naming follows this structure: `chat_1729339335676_yU8y2flu140S.json`.
When data is passed to the client a variable called chats contains all the chats related to the specific user (based on the user's `.chats` property)

```javascript
chats = [
   {			// example for a 1 to 1 chat
    "id": "chat_1731227689056_lLXnUwETFhLJ",
    "participants": [
      [1731228318272, "user_1730493002959_bETfDopWHG"],
      [1731227689056, "user_1729339335679_JN2FdqGzRMeM"]
    ],
    "groupName": "",
    "messages": [
      {
        "id": "msg_1731228318265_MrT6W6Zuc7kU",
        "author": "user_1730493002959_bETfDopWHG",
        "text": [
          [1731228318265, "Hello World"]
        ]
      }
    ]
  },
  {				// example for a group chat
    "id": "chat_1731228493578_42BGf0qQ3hHu",
    "participants": [
      [1731229957044, "user_1729339335678_G1c6wtLUhqLI"],
      [1731229752577, "user_1730493002959_bETfDopWHG"],
      [1731229939789, "user_1729339335676_yU8y2flu140S"]
    ],
    "groupName": "Gruppe Fünf",
    "messages": [
      {
        "id": "msg_1731228503906_4LWey76r4ocB",
        "author": "user_1729339335678_G1c6wtLUhqLI",
        "text": [
          [1731228503906, "Hi my friends"]
        ]
      },
      {
        "id": "msg_1731229740825_gqJ70N5zh2vJ",
        "author": "user_1729339335676_yU8y2flu140S",
        "text": [
          [1731229740825, "So everybody say &#39;Hi&#39;"]
        ]
      },
      {
        "id": "msg_1731229752570_XeWghiBjlcZt",
        "author": "user_1730493002959_bETfDopWHG",
        "text": [
          [1731229752570, "Hi"]
        ]
      }
    ]
  }
]
```



## localStorage

```javascript
localStorageObject = {
    id: currentUser.id,
    rememberMe: true
}
```



## user configuration

Possible keys are:

```javascript
config: {
    mode,			// string | "dark" or "light"
    hue,			// integer > 0 <= 350 | step: 10 | default: 190
    language,		// integer >= 0 | 0 = English | 1 = German | ...
    notifications,	// boolean true or false
    rememberMe,		// boolean true or false
    fullscreen,		// boolean true or false
    allowFindMe,	// boolean true or false
    autoUpdate		// integer > 60000 < 900000 | interval time in ms | default: 120000
}
```



## API

### /ticker.createAccount



### /ticker.confirmEmail



### /ticker.login



### /ticker.quickLogin



### /ticker.editPersonalData



### /ticker.deleteAccount



### /ticker.updateUser



### /ticker.getChat



### /ticker.addNewChat



### /ticker.searchUsers
