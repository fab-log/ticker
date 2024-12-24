<img src="https://github.com/fab-log/ticker/blob/main/public/pix/logo_wide.webp" alt="ticker logo" width="400">

## Easy messaging

***ticker*** is a web based text messaging application written in JavaScript and node.js. It provides a secure user management and chatting options for one to one chats as well as group chats.

Further features are:

- responsive design working on all kinds of screens
- notifications for new messages or new chats
- user interface available in two languages (English, German)
- individual customisation
    - colouring
    - light / dark mode
    - audio on / off
    - fullscreen
    - update interval
- simple formatting including bold and italic text, line breaks
- automatic in text detection for urls, email addresses, and phone numbers
- translate text to morse code by adding `[morse]` to the end of a message

<img src="https://github.com/fab-log/ticker/blob/main/public/pix/devices.webp" alt="ticker app on multiple devices" width="500">

# Manual

## Contacts

#### Search for Contacts

Click on the plus sign at the top. Here, you can check if your friends are already on ticker by entering a name, username, or email address in the search field. If there are results, you can select the corresponding name and start chatting immediately.

#### Invite via Email

You can invite friends who are not yet on ticker by sending them a message with a link to ticker.

#### Groups

Once you have two or more contacts, you can start a group chat. Give the group a name and select the contacts from the list that you want to include in the group. Finally, you can choose a group color.

## Messages

#### Sending messages

Select a chat by clicking or tapping on it to enter the chat. Write a message in the input field. Use the triangular arrow to the right to send the message.
In case you like the encryption you can add [morse] to the end of a message and it will be translated to morse code.

#### Editing and Deleting

If you want to edit or delete a message, you can do so via the context menu. On a smartphone or tablet, press and hold the message until a window with the two options appears. On a PC, this can be done with a right-click.
Note that you can only modify your own messages afterward.

#### Retrieving Messages

As long as the browser window is open, ticker checks for new messages every two minutes.¹ However, you can also manually refresh messages by clicking/tapping the icon with the two circular arrows at the top. Additionally, you can adjust the automatic interval in the settings.

¹ Depending on the device and settings, other factors such as power-saving mode or do-not-disturb mode may affect whether and how long ticker remains active in the background.

#### Learn more about your chat partners

On top of the chat messages you find the name of your chat partner or the chat group. Klick or tap on that name to get more information about them.

## Settings

#### Language

Here, you can select your preferred language. Currently, English and German are available.

#### Status

Directly below, you can write something about yourself or what’s on your mind. This information is visible to your contacts. It remains until you delete it or replace it with something else.

#### Color Scheme

This option allows you to influence the general appearance of the app. You determine the accent color, and ticker automatically selects other matching colors.
This color will also be displayed to your contacts.

#### Mode

Light or dark mode is often a matter of preference. Try out what works best for you. Generally, dark mode is suitable for darker environments or prolonged screen use, while light mode is recommended for bright surroundings.

#### Sounds

When sending and receiving messages, ticker plays short notification sounds, which you can enable or disable here.

#### Fullscreen

Choose fullscreen mode to hide browser tools like the address bar or tabs overview.

#### Update Interval

Here, you can set how frequently messages are automatically retrieved. The value is specified in minutes.

#### User Profile

You can change your user data, such as name and email address. If you want to adjust your password or permissions, you can do so here as well. Please note that your contacts will always see you with your username (if provided) or your first and last name. They may also find you using this information. The email address specified here must be used for login.

#### Permissions

- **Allow notifications**: 
Decide whether your device is allowed to display notifications.
- **Stay logged in on this browser**: 
With this option, you don’t need to log in every time you access ticker. This option is very convenient but should only be used on devices protected by PIN codes, facial recognition, etc. Once you explicitly log out, this setting will be reset.
- **Allow other ticker users to find you**: 
This is the only way you can be found on ticker. Other users can search for you using your first and last name, username, or email address.

#### Log Out

On devices used by multiple people, it may be advisable to log out after use. This ensures that no one can view your messages. To log back in, you will need your email address and password.



# Documentation

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
        "autoUpdate": 900000,
        "audio": true
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
    "password": ["U9LJs3dHvFnO","8911f189b25624f000cedf1bad9966411c5e6ca23b9ab277cc7a9d1f9f462f9f"]	
    // password is not included when data is passed to client
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
      "Green Tomatoes"
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
    "groupName": "Group n° 5",
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
    autoUpdate,		// integer > 60000 < 900000 | interval time in ms | default: 120000
    audio           // boolean true or false
}
```



## API

### /ticker.createAccount



### /ticker.inviteByMail



### /ticker.confirmEmail



### /ticker.login



### /ticker.quickLogin



### /ticker.forgotPassword



### /ticker.getUser



### /ticker.editPersonalData



### /ticker.updateUserSilent



### /ticker.deleteAccount



### /ticker.getConnectedUsers



### /ticker.getChat



### /ticker.addNewChat



### /ticker.updateChat



### /ticker.searchUsers



### /ticker.monitor
