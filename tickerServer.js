const express = require("express");
const fs = require("fs");
const crypto = require('crypto');

// Alternative to crypto:
// const CryptoJS = require('crypto-js');

const { request } = require("http");
const nodemailer = require('nodemailer');
const formidable = require('formidable');
const path = require('path');
// const multer = require('multer');

const app = express();
app.use(express.static("public"));
app.use(express.json({ limit: "100mb" }));

const port = 8003;


// ############
// ### MAIL ###
// ############
const transporter = nodemailer.createTransport({
    host: "smtp.strato.de",
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
      user: "noreply@fablog.eu",
      pass: "mxvNfgAWFWps",
    }
});

const sendVerificationEmail = (userEmail, verificationCode) => {
    // console.log("### => fn sendVerificationEmail to " + userEmail + " triggered");
    const mailOptions = {
        from: 'noreply@fablog.eu',
        to: userEmail,
        subject: 'ticker app email verification',
        html: `
            <style>
                body {
                    background-color: hsl(30, 15%, 88%);
                    color: hsl(30, 25%, 12%);
                    font-size: 1.1rem;
                    line-height: 1.2;
                    margin: 0;
                    padding: 25px;
                }
                img {
                    width: 150px;
                }
            </style>
            <img src="https://fablog.eu/assets/logo_wide.png" alt="ticker logo" width="150">
            <h1>Welcome to ticker!</h1>
            <p>Please paste the following verification code to the ticker app within the next 15 minutes.</p>
            <h3>${verificationCode}</h3>
            <br><hr><br>
            <h1>Willkommen bei ticker!</h1>
            <p>Bitte kopiere den Prüfcode innerhalb der nächsten 15 Minuten in die ticker app.</p>
            <h3>${verificationCode}</h3>
            <br>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error occurred: ' + error.message);
        }
        console.log('Email sent: ' + info.response);
    });
};

const sendInvitationEmail = (recipientEmail, subject, body) => {
    const mailOptions = {
        from: 'noreply@fablog.eu',
        to: recipientEmail,
        subject,
        html: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error occurred: ' + error.message);
        }
        console.log('Email sent: ' + info.response);
    });
}

const sendResetPasswordEmail = (recipientEmail, subject, body) => {
    const mailOptions = {
        from: 'noreply@fablog.eu',
        to: recipientEmail,
        subject,
        html: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error occurred: ' + error.message);
        }
        console.log('Email sent: ' + info.response);
    });
}

const verificationTimer = (email) => {
    // console.log("### => fn verificationTimer triggered");
    setTimeout(() => {
        fs.readFile("./ticker_db/emailVerification.json", "utf8", (err, emailVerifications) => {
            if (err) {
                res.status = "server error";
                response.json(res);
                throw err;
                }
            let emailVerificationsArray = JSON.parse(emailVerifications);
            let index = emailVerificationsArray.findIndex(e => e.data.email.at(-1)[2] === email);
            emailVerificationsArray.splice(index, 1);
            fs.writeFile("./ticker_db/emailVerification.json", JSON.stringify(emailVerificationsArray), (err) => {
                if (err) {
                    res.status = "server error";
                    response.json(res);
                    throw err;
                }
            });
        });        
    }, 180000);  // 1800000 = 30 minutes
}


// ##################
// ### FORMIDABLE ###
// ##################

/* app.post('/ticker.upload', (req, res, next) => {

    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, './ticker_db/assets/');
    form.keepExtensions = true; // Keep file extension

    form.parse(req, (err, fields, files) => {
        if (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Error parsing the file.' }));
        }

        const oldPath = files.image.path;
        console.log({ oldPath });
        const ext = path.extname(files.image.name);
        const fileName = `asset_${Date.now()}_${randomCyphers(12)}${ext}`;
        const newPath = path.join(form.uploadDir, fileName);

        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Error saving the file.' }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'File uploaded successfully!', fileName }));
        });
    });
}); */


// ######################
// ### RANDOM CYPHERS ###
// ######################
const cyphers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const randomCyphers = (length) => {
	if (!length) {
		length = 10;
	}
    let randomString = "";
    for (i = 0; i < length; i++) {
        randomString += cyphers[Math.floor(Math.random() * cyphers.length)];
    }
    return randomString;
}

const randomNumbers = (length) => {
	if (!length) {
		length = 10;
	}
    let randomNumbers = "";
    for (i = 0; i < length; i++) {
        randomNumbers += cyphers[Math.floor(Math.random() * 10)];
    }
    return randomNumbers;
}


// ############
// ### HASH ###
// ############
const hash = (string) => {
    let cryptoArray = [];
    let salt = randomCyphers(12);
    let saltedString = salt + string;
    let hashed = crypto.createHash('sha256').update(saltedString).digest('hex');
    cryptoArray.push(salt, hashed);
    /* // Alternative using CryptoJS (needs to be imported first [ const CryptoJS = require('crypto-js'); ])
    let hashed = CryptoJS.SHA256(saltedString).toString(CryptoJS.enc.Hex);
    cryptoArray.push(salt, hashed); */
    return cryptoArray;
}

const checkHash = (salt, pepper) => {
    let saltedPepper = salt + pepper;
    return crypto.createHash('sha256').update(saltedPepper).digest('hex');
    /* // Alternative using CryptoJS
    return CryptoJS.SHA256(saltedPepper).toString(CryptoJS.enc.Hex); */
}


// ###############
// ### MONITOR ###
// ###############

let monitor = {};
let numberOfCalls = 0;

const readMonitorData = () => {
    fs.readFile("./ticker_db/monitor.json", "utf8", (err, data) => {
        if (err) {
            console.log("error reading monitor file");
            }
        monitor = JSON.parse(data);
    });
}

readMonitorData();

const updateMonitor = (key) => {
    monitor[key] += 1;
    if (key === "regularLogins" || key === "quickLogins") {
        monitor.totalLogins += 1;
    }
    numberOfCalls += 1;
}

const writeMonitorData = () => {
    if (numberOfCalls > 0) {
        fs.writeFile("./ticker_db/monitor.json", JSON.stringify(monitor), (err) => {
        if (err) {
            console.log("error writing monitor file");
        }
        });
        numberOfCalls = 0;
    }
    
}

setInterval(writeMonitorData, 60000);


// #########################################
// ### USERS' CACHE (IN MEMORY DATABASE) ###
// #########################################

let usersCache;
let numberOfEdits = 0;

const readUsersDb = () => {
    fs.readFile("./ticker_db/users.json", "utf8", (err, users) => {
        if (err) {
            console.log("error @ readUsersDb");
            throw err;
        }
        usersCache = JSON.parse(users);
    });
}

readUsersDb();

const writeUsersDb = () => {
    if (numberOfEdits > 0) {
        fs.writeFile("./ticker_db/users.json", JSON.stringify(usersCache), (err) => {
            if (err) {
                console.log("error @ writeUsersDb");
                throw err;
            }
        });
        console.log("users.json successfully written");
        numberOfEdits = 0;
    }
}

setInterval(writeUsersDb, 60000);  // 600000


// #####  #####    #
// #   #  #   #    #
// #####  #####    #
// #   #  #        #
// #   #  #        #

app.post("/ticker.createAccount", (request, response) => {
    const data = request.body;
    let res = {};
    let usersArray = structuredClone(usersCache);
    if (usersArray.find((e) => e.email.at(-1)[2] === data.email.at(-1)[2])) {
        response.json({ status: "Email already exists." });
        return;
    }
    fs.readFile("./ticker_db/emailVerification.json", "utf8", (err, emailVerifications) => {
        if (err) {
            res.status = "server error";
            response.json(res);
            throw err;
        }
        let password = data.password;
        hashedPassword = hash(password);
        data.password = hashedPassword;
        let emailVerificationsArray = JSON.parse(emailVerifications);
        let verificationCode = randomNumbers(6);
        sendVerificationEmail(data.email.at(-1)[2], verificationCode);
        let verificationObject = {
            date: Date.now(),
            data,
            verificationCode
        };
        emailVerificationsArray.push(verificationObject);
        fs.writeFile("./ticker_db/emailVerification.json", JSON.stringify(emailVerificationsArray), (err) => {
            if (err) {
                res.status = "server error";
                response.json(res);
                throw err;
            }
            verificationTimer(data.email.at(-1)[2]);
            res.status = "OK";
            delete data.password;
            res.data = data;
            response.json(res);
            updateMonitor("createdAccounts");
        });
    });
});

app.post("/ticker.inviteByMail", (request, response) => {
    const data = request.body;
    let res = {};
    let parsedUserData = structuredClone(usersCache);
    if (parsedUserData.some(e => e.email.at(-1)[2] === data.recipientEmail)) {
        res.status = "email exists";
        response.json(res);
        return;
    }
    sendInvitationEmail(data.recipientEmail, data.subject, data.body);
    res.status = "OK";
    response.json(res);
    updateMonitor("inviteByMail");
});

app.post("/ticker.confirmEmail", (request, response) => {
    const data = request.body;
    let res = {};
    fs.readFile("./ticker_db/emailVerification.json", "utf8", (err, emailVerifications) => {
        if (err) {
            res.status = "server error";
            response.json(res);
            throw err;
            }
        let emailVerificationsArray = JSON.parse(emailVerifications);
        let index = emailVerificationsArray.findIndex(e => e.data.email.at(-1)[2] === data.email);
        if (index === -1) {
            res.status = "Data not found.<br>Please try again";
            response.json(res);
            return;
        }
        if (emailVerificationsArray[index].verificationCode != data.input) {
            res.status = "Verification code is not correct";
            response.json(res);
            return;
        }
        let newUser = emailVerificationsArray[index].data;
        newUser.config = data.config;

        // ###########
        // ### !!! ###
        // ###########
        usersCache.push(newUser);
        numberOfEdits += 1;

        res.status = "OK";
        res.data = newUser;
        response.json(res);
        updateMonitor("confirmEmail");
    });
})

app.post('/ticker.login', (request, response) => {
    const data = request.body;
    let parsedUserData = structuredClone(usersCache);
    let index = parsedUserData.findIndex(e => e.email.at(-1)[2] === data.email);
    let res = {};
    if (index === -1) {
        res.status = "email does not exist";
        response.json(res);
        return;
    }
    if (parsedUserData[index].password[1] != checkHash(parsedUserData[index].password[0], data.password)) {
        res.status = "password incorrect";
        response.json(res);
        return;
    }
    if (parsedUserData[index].email.at(-1)[2].toLowerCase() === data.email.toLowerCase() && parsedUserData[index].password[1]  === checkHash(parsedUserData[index].password[0], data.password)) {
        if (parsedUserData[index].config.rememberMe != data.rememberMe) {
            parsedUserData[index].config.rememberMe = data.rememberMe;

            // ###########
            // ### !!! ###
            // ###########
            usersCache = structuredClone(parsedUserData);
            numberOfEdits += 1;
            res.status = "OK";
            delete parsedUserData[index].password;
            res.data = parsedUserData[index];
            response.json(res);
        } else {
            res.status = "OK";
            delete parsedUserData[index].password;  // ### !!! ###
            res.data = parsedUserData[index];
            response.json(res);
            updateMonitor("regularLogins");
        }            
    }
});

app.post('/ticker.quickLogin', (request, response) => {
    const data = request.body;
    let parsedUserData = structuredClone(usersCache);
    let index = parsedUserData.findIndex(e => e.id === data.id);
    let res = {};
    if (index === -1) {
        res.status = "Error! Please try to log in again";
        response.json(res);
    } else {
        res.status = "OK";
        delete parsedUserData[index].password;  // ### !!! ###
        res.data = parsedUserData[index];
        response.json(res);
        updateMonitor("quickLogins");
    }
});

app.post('/ticker.forgotPassword', (request, response) => {
    const data = request.body;
    let parsedUserData = structuredClone(usersCache);
    let index = parsedUserData.findIndex(e => e.email.at(-1)[2] === data.email);
    let res = {};
    if (index === -1) {
        res.status = "Error!<br>No valid email<br><br>Fehler!<br>Keine gültige E-Mail-Adresse";
        response.json(res);
        return;
    }
    res.status = "OK";
    let recipient = parsedUserData[index].email.at(-1)[2];        
    let newPassword = randomCyphers(12);
    let subject = "ticker password reset";
    let body = `
        <style>
            body {
                background-color: hsl(30, 15%, 88%);
                color: hsl(30, 25%, 12%);
                font-size: 1.1rem;
                line-height: 1.2;
                margin: 0;
                padding: 25px;
            }
            img {
                width: 150px;
            }
        </style>
        <img src="https://fablog.eu/assets/logo_wide.png" alt="ticker logo" width="150">
        <h1>Passwort reset!</h1>
        <p>Your password has been reset. See your new password below.</p>
        <h4>${newPassword}</h4>
        <p>Please make sure to set your own password as soon as possible. You can do so in the settings menu within the app by choosing <i>'user profile'</i> and <i>'edit'</i></p>
        <br><hr><br>
        <h1>Passwort zurückgesetzt!</h1>
        <p>Dein Passwort wurde zurückgesetzt. Es lautet wie folgt:</p>
        <h4>${newPassword}</h4>
        <p>Bitte setze sobald wie möglich ein eigenes Password. Du findest die entsprechende Möglichkeit im Einstellungsmenü der App unter <i>'Nutzerprofil'</i> und dann <i>'ändern'</i></p>
        <br>
    `;

    sendResetPasswordEmail(recipient, subject, body);
    parsedUserData[index].password = hash(newPassword);

    // ###########
    // ### !!! ###
    // ###########
    usersCache = structuredClone(parsedUserData);
    numberOfEdits += 1;

    response.json(res);
    updateMonitor("forgotPassword");
});

app.post("/ticker.getUser", (request, response) => {
    const data = request.body;
    let parsedUserData = structuredClone(usersCache);
    let index = parsedUserData.findIndex(e => e.id === data.id);
    if (index === -1) {
        res.status = "server error getting user data";
        response.json(res);
        return;
    }
    let res = {};
    let user = parsedUserData[index];
    delete user.password;
    res.status = "OK";
    res.data = user;
    response.json(res);
    updateMonitor("getUser");
})

app.post("/ticker.editPersonalData", (request, response) => {
    const data = request.body;
    let res = {};
    let parsedUserData = structuredClone(usersCache);
    let index = parsedUserData.findIndex(e => e.id === data.user.id);
    if (index === -1) {
        res.status = "error: user not found";
        response.json(res);
        return;
    }
    if (parsedUserData.some(e => e.email.at(-1)[2] === data.user.email.at(-1)[2]) && data.user.email.at(-1)[2] != parsedUserData[index].email.at(-1)[2]) {
        res.status = "No valid data<br><br>Ungültige Eingabe";
        response.json(res);
        return;
    }
    if (data.oldPassword) {
        if (checkHash(parsedUserData[index].password[0], data.oldPassword) != parsedUserData[index].password[1]) {
            res.status = "Wrong input<br><br>Falsche Eingabe";
            response.json(res);
            return;
        }
        data.user.password = hash(data.newPassword);
    } else {
        data.user.password = parsedUserData[index].password;
    }
    parsedUserData.splice(index, 1, data.user);

    // ###########
    // ### !!! ###
    // ###########
    usersCache = structuredClone(parsedUserData);
    numberOfEdits += 1;

    res.status = "OK";
    res.alert = "Changes were saved.<br><br>Änderungen gespeichert."
    delete parsedUserData[index].password;  // ### !!! ###
    res.data = parsedUserData[index];
    response.json(res);
    updateMonitor("editPersonalData");
});

app.post("/ticker.updateUserSilent", (request, response) => {
    const data = request.body;
    let res = {};
    let parsedUserData = structuredClone(usersCache);
    let index = parsedUserData.findIndex(e => e.id === data.id);
    if (index === -1) {
        res.status = "error: user not found";
        response.json(res);
        return;
    }
    let passwordsArray = parsedUserData[index].password;
    data.password = passwordsArray;
    parsedUserData.splice(index, 1, data);    

    // ###########
    // ### !!! ###
    // ###########
    usersCache = structuredClone(parsedUserData);
    numberOfEdits += 1;
    
    res.status = "OK";
    delete parsedUserData[index].password;  // ### !!! ###
    res.data = parsedUserData[index];
    response.json(res);
    updateMonitor("updateUserSilent");
});

app.post("/ticker.deleteAccount", (request, response) => {
    const data = request.body;
    let res = {};
    let parsedUserData = structuredClone(usersCache);
    let index = parsedUserData.findIndex(e => e.id === data.id);
    if (parsedUserData[index].password[1] != checkHash(parsedUserData[index].password[0], data.password)) {
        res.status = "password incorrect!<br><br>Falsches Passwort!";
        response.json(res);
        return;
    }
    parsedUserData.splice(index, 1);

    // ###########
    // ### !!! ###
    // ###########
    usersCache = structuredClone(parsedUserData);
    numberOfEdits += 1;

    console.log(`User ${data.id} has been successfully removed.`);
    res.status = "OK";
    res.id = data.id;
    response.json(res);
    updateMonitor("deleteAccount");
});

/* app.post("/ticker.updateUser", (request, response) => {
    let data = request.body;
    let res = {};
    let parsedUsers = structuredClone(usersCache);
    let updatedUser = data.userObject;
    let index = parsedUsers.findIndex(e => e.id === updatedUser.id);
    if (index === -1) {
        res.status = "user not found";
        response.json(res);
        return;
    }
    updatedUser.password = parsedUsers[index].password;
    // console.log("PW: " + updatedUser.password);
    parsedUsers.splice(index, 1, updatedUser);
    
    // ###########
    // ### !!! ###
    // ###########
    usersCache = structuredClone(parsedUsers);
    numberOfEdits += 1;

    delete updatedUser.password;
    res.data = updatedUser;
    res.status = "OK";
    response.json(res);
    updateMonitor("updateUser");
}); */

app.post('/ticker.getConnectedUsers', (request, response) => {
    const id = request.body.id;
    let res = {};

    let parsedUserData = structuredClone(usersCache);
    let index = parsedUserData.findIndex(element => element.id === id);
    let currentUser = parsedUserData[index];

    let connectedUsers = [];
    currentUser.chatPartners.forEach(e => {
        let index2 = parsedUserData.findIndex(el => el.id === e);
        if (index2 === -1) return;
        let connectedUserObject = {
            id: parsedUserData[index2].id,
            firstName: parsedUserData[index2].firstName.at(-1)[2],
            lastName: parsedUserData[index2].lastName.at(-1)[2],
            userName: parsedUserData[index2].userName.at(-1)[2],
            profilePix: parsedUserData[index2].profilePix,
            about: parsedUserData[index2].about,
            hue: parsedUserData[index2].config.hue
        };
        connectedUsers.push(connectedUserObject);
    });
    res.status = "OK";
    res.data = connectedUsers;
    response.json(res);
    updateMonitor("getConnectedUsers");
});

app.post("/ticker.getChat", (request, response) => {
    let data = request.body;
    let fileName = `./ticker_db/${data.chatId}.json`;
    let res = {};
    fs.readFile(fileName, "utf8", (err, chat) => {
        if (err) {
            res.status = "server error";
            response.json(res);
            throw err;
        }
        res.status = "OK";
        res.data = JSON.parse(chat);
        response.json(res);
        updateMonitor("getChat");
    });
});

app.post("/ticker.addNewChat", (request, response) => {
    let data = request.body;
    let fileName = `./ticker_db/${data.newChat.id}.json`;
    let res = {};
    let parsedUserData = structuredClone(usersCache);
    let indexCurrentUser = parsedUserData.findIndex(e => e.id === data.newChat.participants[0][1]);
    let indexNewChatPartner = parsedUserData.findIndex(e => e.id === data.newChat.participants[1][1]);  // necesssary?
    let currentUser = parsedUserData[indexCurrentUser];
    // currentUser.chats.push(data.newChat.id);
    let newChatPartners = [];
    data.newChat.participants.forEach(e => {
            newChatPartners.push(e[1]);
    });
    newChatPartners.forEach(e => {     // only matches for 1 to 1 chats, not for groups
        if (e !== currentUser.id) {
            currentUser.chatPartners.push(e);
        }
        let index = parsedUserData.findIndex(el => el.id === e);
        let newChatPartnersMinusSelf = newChatPartners.filter(element => element != parsedUserData[index].id);
        parsedUserData[index].chatPartners.push(...newChatPartnersMinusSelf);
        parsedUserData[index].chatPartners = [...new Set(parsedUserData[index].chatPartners)];      // remove duplicates
        parsedUserData[index].chats.push(data.newChat.id);
    });
    currentUser.chatPartners = [...new Set(currentUser.chatPartners)];      // remove duplicates
    
    /* if (currentUser.chatPartners.includes(parsedUserData[indexNewChatPartner].id) === false) {
        currentUser.chatPartners.push(parsedUserData[indexNewChatPartner].id);
    } */
    /* if (parsedUserData[indexNewChatPartner].chatPartners.includes(currentUser.id) === false) {
        parsedUserData[indexNewChatPartner].chatPartners.push(currentUser.id);
    }        
    parsedUserData[indexNewChatPartner].chats.push(data.newChat.id); */

    // ###########
    // ### !!! ###
    // ###########
    usersCache = structuredClone(parsedUserData);
    numberOfEdits += 1;

    fs.writeFile(fileName, JSON.stringify(data.newChat), (err) => {
        if (err) {
            res.status = "server error";
            response.json(res);
            throw err;
        }
        res.status = "OK";
        delete currentUser.password;
        res.data = currentUser;
        response.json(res);
        updateMonitor("addNewChat");
    });
});

app.post("/ticker.updateChat", (request, response) => {
    let data = request.body;
    let fileName = `./ticker_db/${data.chat.id}.json`;
    let res = {};
    fs.readFile(fileName, "utf8", (err, chat) => {
        if (err) {
            res.status = "server error";
            response.json(res);
            throw err;
        }
        let parsedChat = JSON.parse(chat);
        parsedChat.groupName = data.chat.groupName;                             // only important if group name has been edited
        
        // ##############################################
        // ### Add / remove participants if necessary ###
        // ##############################################
        const extractIds = (participants) => {
            return participants.map(participant => participant[1]);
        }
        
        const clientIds = new Set(extractIds(data.chat.participants));
        const savedIds = new Set(extractIds(parsedChat.participants));
        
        const removedParticipants = [...savedIds].filter(id => !clientIds.has(id));
        const addedParticipants = [...clientIds].filter(id => !savedIds.has(id));
        if (addedParticipants.length > 0 || removedParticipants.length > 0) {
            let parsedUsers = structuredClone(usersCache);

            if (addedParticipants.length > 0) {
                let chatPartners = data.chat.participants.map(element => element[1]);                   // convert to array including ids only
                addedParticipants.forEach(e => {
                    let index = parsedUsers.findIndex(el => el.id === e);
                    parsedUsers[index].chats.push(data.chat.id);
                    chatPartners = chatPartners.filter(element => element != parsedUsers[index].id);    // remove user's own id from array
                    parsedUsers[index].chatPartners.push(...chatPartners);                              // spread and push to user's chat partners
                    parsedUsers[index].chatPartners = [...new Set(parsedUsers[index].chatPartners)];    // remove duplicates
                });
            }

            if (removedParticipants.length > 0) {
                removedParticipants.forEach(e => {
                    let index = parsedUsers.findIndex(el => el.id === e);
                    let index2 = parsedUsers[index].chats.findIndex(el => el === data.chat.id);
                    parsedUsers[index].chats.splice(index2, 1);
                });
            }

            // ###########
            // ### !!! ###
            // ###########
            usersCache = structuredClone(parsedUsers);
            numberOfEdits += 1;

        }
        parsedChat.participants = data.chat.participants;                       // only important if group participants have been edited
        let sender = data.userId;
        let index = parsedChat.participants.findIndex(e => e[1] === sender);    // identify sender
        let timestamp = Date.now();
        parsedChat.participants[index][0] = timestamp;                          // update timestamp for last seen
        parsedChat.messages = data.chat.messages;

        fs.writeFile(fileName, JSON.stringify(parsedChat), (err) => {
            if (err) {
                res.status = "server error";
                response.json(res);
                throw err;
            }
            res.status = "OK";
            res.data = parsedChat;
            response.json(res);
            updateMonitor("sentMessages");
        });
    });
});

app.post("/ticker.searchUsers", (request, response) => {
    let data = request.body;
    let res = {};
    let parsedUsers = structuredClone(usersCache);
    let result = [];
    let searchString = data.searchString.toLowerCase()
    parsedUsers.forEach(e => {
        if ((e.firstName.at(-1)[2].toLowerCase() === searchString || e.lastName.at(-1)[2].toLowerCase() === searchString || e.userName.at(-1)[2].toLowerCase() === searchString || e.email.at(-1)[2].toLowerCase() === searchString) && e.active.at(-1)[2] === true && e.config.allowFindMe === true) {
            result.push([e.id, e.firstName.at(-1)[2], e.lastName.at(-1)[2], e.userName.at(-1)[2]])
        }
    });
    res.status = "OK";
    res.data = result;
    response.json(res);
    updateMonitor("searchUsers");
});

app.get("/ticker.monitor", (request, response) => {
    fs.readFile("./ticker_db/monitor.json", "utf8", (err, data) => {
        if (err) {
            return response.status(500).json({ status: "server error reading monitor file" });
        }
        
        let monitor;
        try {
            monitor = JSON.parse(data);
        } catch (parseError) {
            return response.status(500).json({ status: "error parsing monitor file" });
        }

        const html = `
        <head>
            <style>
                body {
                    padding: 50px;
                    background-color: hsl(30, 10%, 10%);
                    color: hsl(30, 10%, 75%);
                    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                }
                img {
                    width: 150px;
                }
                table {
                    text-align: right;
                }
                h2, button {
                    margin-top: 25px;
                }
                td, th {                    
                    padding: 3px 12px;
                    border-bottom: solid 1px hsl(30, 10%, 20%);
                }
            </style>
        </head>
        <script>
            const refreshMonitor = () => {
                window.location.reload();
            }
        </script>
        <img src="https://fablog.eu/assets/logo_wide.png" alt="ticker logo">
        <h2>monitor</h2>
        <table>
            <tr>
                <th><b>Item</b></th><th><b>Value</b></th>
            </tr>
            <tr>
                <td>created accounts</td><td>${monitor.createdAccounts}</td>
            </tr>
            <tr>
                <td>deleteAccount</td><td>${monitor.deleteAccount}</td>
            </tr>
            <tr>
                <td>confirmEmail</td><td>${monitor.confirmEmail}</td>
            </tr>
            <tr>
                <td>total logins</td><td>${monitor.totalLogins}</td>
            </tr>
            <tr>
                <td>regular logins</td><td>${monitor.regularLogins}</td>
            </tr>
            <tr>
                <td>quick logins</td><td>${monitor.quickLogins}</td>
            </tr>
            <tr>
                <td>getUser</td><td>${monitor.getUser}</td>
            </tr>
            <tr>
                <td>searchUsers</td><td>${monitor.searchUsers}</td>
            </tr>
            <tr>
                <td>inviteByMail</td><td>${monitor.inviteByMail}</td>
            </tr>
            <tr>
                <td>editPersonalData</td><td>${monitor.editPersonalData}</td>
            </tr>
            <tr>
                <td>updateUserSilent</td><td>${monitor.updateUserSilent}</td>
            </tr>
            <tr>
                <td>updateUser</td><td>${monitor.updateUser}</td>
            </tr>
            <tr>
                <td>getConnectedUsers</td><td>${monitor.getConnectedUsers}</td>
            </tr>
            <tr>
                <td>getChat</td><td>${monitor.getChat}</td>
            </tr>
            <tr>
                <td>new chats</td><td>${monitor.addNewChat}</td>
            </tr>
            <tr>
                <td>sent messages</td><td>${monitor.sentMessages}</td>
            </tr>
        </table>
        <button type="button" onclick="refreshMonitor()">refresh</button>
        `;

        // response.json({ status: "OK", data: html });
        response.send(html);
    });
});


// ####################
// ### START SERVER ###
// ####################

app.listen(port, () => console.log(`listening at ${port}`));
