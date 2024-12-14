let connectedUsers = [];

const pLoggedInUser = document.querySelector("#pLoggedInUser");
const menuPersonal = document.querySelector("#menuPersonal");

const confirmAccount = async (email, input, config) => {
    console.log("### => fn confirmAccount triggered");
    startLoader();
    let data = {
        email,
        input,
        config
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch("/ticker.confirmEmail", options);
    let serverResponse = await response.json();
    let status = serverResponse.status;
    console.log({ status });
    stopLoader();
    if (status != "OK") {
        showAlert(status);
        return;
    }
    currentUser = serverResponse.data;
    pLoggedInUser.innerHTML = currentUser.email.at(-1)[2];
    modal.innerHTML = "";
    closeModal();
    renderOverview();
    document.querySelectorAll(".home-item").forEach(e => {
		e.style.display = "none";
	});
    logoHeader.style.display = "block";
    imgOverviewHeaderPlus.style.display = "block";
    imgOverviewHeaderUpdate.style.display = "block";
    menuPersonal.style.display = "block";
    pLoggedInUser.innerHTML = currentUser.email.at(-1)[2];
    applyConfig();    
    // await getConnectedUsers(); 
    // await getChats();
    // renderOverview();
}

const termsEn = `
    <hr>
    <h3>Terms of Service</h3>
    <p>This software comes 'as is' without any warranties concerning its functionality. </p>
    <h3>Privacy</h3>
    <p><b>Very simple.</b></p>
    <ul>
            <li>No advertising.</li>
            <li>No trackers.</li>
            <li>No preconnect. <small>(download of third party content)</small></li>
    </ul>    
    <p>Data you provide will be stored in a database on the server. The connection to the server is secured using the HTTPS protocol. No data is stored in another location, nor will any data be transferred to other parties.<br>
    To delete your data, you can use the corresponding built-in feature, which can be found in the settings menu of this application.</p>
    <h3>Imprint</h3>
    <p>Responsible person for this site:<br>
    Fabian Ruin</p>    
    <p>contact:<br>
    info[æ]fablog.eu</p>
`;

const termsDe = `
    <hr>
    <h3>Nutzungsbedingungen</h3>
    <p>Diese Software wird in ihrem derzeitigen Zustand ohne jegliche Garantien bezüglich der Funktionalität bereitgestellt</p>
    <h3>Datenschutz</h3>
    <p><b>Ganz einfach.</b></p>
    <ul>
            <li>Keine Werbung.</li>
            <li>Keine Tracker.</li>
            <li>Kein preconnect. <small>(Download von Drittanbieter-Inhalten)</small></li>
    </ul>    
    <p>Daten, die Sie angeben, werden in einer Datenbank auf dem Server gespeichert. Die Verbindung zum Server ist mithilfe des https-Protokolls abgesichert. Es werden keine Daten an anderer Stelle gespeichert oder weitergegeben.<br>
    Um Ihre Daten zu löschen, nutzen Sie die entsprechende Funktionalität innerhalb der App, die Sie in den Einstellunge finden.</p>
    <h3>Impressum</h3>
    <p>Verantwortliche Person:<br>
    Fabian Ruin</p>    
    <p>Kontakt:<br>
    info[æ]fablog.eu</p>
`

const verifyEmail = (email) => {
    console.log("### => fn verifyEmail triggered");
    /* <p>
        <input type="checkbox" id="inpVerifyAllowFullscreen">
        <label for="inpVerifyAllowFullscreen">${lang('Allow fullscreen mode (recommended for smartphones)', 'Vollbild-Modus erlauben (empfohlen für Smartphones)')}</label>
    </p> */
    modal.innerHTML = `
        <form>
            <div style="text-align: left;">
                <h3>${lang('Confirm Email', 'E-Mail-Adresse bestätigen')}</h3>
                <h4>${lang("Please do not close this tab until the registration is confirmed!", "Bitte schließe diesen Tab nicht bis die Registrierung abgeschlossen ist!")}</h4>
                <hr>
                <p>
                    <input type="checkbox" id="inpVerifyEmailAllowNotifications">
                    <label for="inpVerifyEmailAllowNotifications">${lang('Allow notifications (recommended)', 'Benachrichtigungen erlauben (empfohlen)')}</label>
                </p>
                <p>
                    <input type="checkbox" id="inpVerifyEmailRememberMe">
                    <label for="inpVerifyEmailRememberMe">${lang('Remember me in this browser on this device', 'In diesem Browser auf diesem Gerät angemeldet bleiben')}</label>
                </p>
                <p>
                    <input type="checkbox" id="inpVerifyEmailAllowFindMe">
                    <label for="inpVerifyEmailAllowFindMe">${lang('Allow ticker users to find you', 'Anderen ticker-NutzerInnen erlauben, dich zu finden')}</label>
                </p>
                <p>
                    <input type="checkbox" id="inpVerifyEmailAgreeTerms">
                    <label for="inpVerifyEmailAgreeTerms">${lang('Agree with the terms of service and privacy (mandatory)', 'Den Nutzungs- und Datenschutzrichtlinien zustimmen (notwendig)')}</label>
                </p>
                <button type="button" id="btnToggleTerms">${lang('show/hide terms', 'AGB ein-/ausblenden')}</button>
            </div>
            <div id="divTerms" style="text-align: left;"></div>
            <hr>
            <p>${lang('Please enter the verification code that has been sent to your email address.', 'Bitte gib den Prüfcode ein, der an deine E-Mail-Adresse geschickt wurde.')}</p>
            <input type="number" placeholder="${lang('verfication code', 'Prüfcode')}" id="inpEmailVerificationCode" max="1000000">
            <hr>
            <button type="button" onclick="dismiss()">${lang('dismiss', 'abbrechen')}</button>
            <button type="submit" id="btnSubmitEmailVerificationCode">${lang('confirm account', 'Konto bestätigen')}</button>
        </form>
        <div class="camouflage"></div>
    `;
    const inpVerifyEmailAllowNotifications = document.querySelector("#inpVerifyEmailAllowNotifications");
    const inpVerifyEmailRememberMe = document.querySelector("#inpVerifyEmailRememberMe");
    // const inpVerifyAllowFullscreen = document.querySelector("#inpVerifyAllowFullscreen");
    const inpVerifyEmailAllowFindMe = document.querySelector("#inpVerifyEmailAllowFindMe");
    const inpVerifyEmailAgreeTerms = document.querySelector("#inpVerifyEmailAgreeTerms");
    const btnSubmitEmailVerificationCode = document.querySelector("#btnSubmitEmailVerificationCode");
    const btnToggleTerms = document.querySelector("#btnToggleTerms");
    const divTerms = document.querySelector("#divTerms");
    divTerms.classList.remove("slide-open");
    btnToggleTerms.addEventListener("click", () => {
        if (divTerms.classList.contains("slide-open")) {
            divTerms.classList.remove("slide-open");
            divTerms.classList.add("collapse-vertically");
            divTerms.innerHTML = "";
        } else {
            divTerms.classList.remove("collapse-vertically");
            divTerms.innerHTML = lang(termsEn, termsDe);
            divTerms.classList.add("slide-open");
        }
    });
    btnSubmitEmailVerificationCode.addEventListener("click", async (event) => {
        event.preventDefault();
        const input = document.querySelector("#inpEmailVerificationCode").value.trim();
        if (input === "") {
            showAlert(lang('no input', 'Eingabe fehlt'));
            return;
        }
        if (input.length < 6) {
            showAlert(lang('input not complete<br>(6 digits required)', 'Eingabe zu kurz<br>(6 Ziffern benötigt)'));
            return;
        }
        if (input.length > 6) {
            showAlert(lang('input too long<br>(6 digits required)', 'Eingabe zu lang<br>(6 Ziffern benötigt)'));
            return;
        }
        if (!inpVerifyEmailAgreeTerms.checked) {
            showAlert(lang('You need to agree to the terms of service to continue', 'Zustimmung zu den Nutzungs- und Datenschutzrichtlinien fehlt.'));
            return;
        }
        if (inpVerifyEmailAllowNotifications.checked) {
            startLoader();
            showAlert(lang("Please also grant notifications in your browser", "Bitte stimme den Benachrichtigungen auch in deinem Browser zu"));
            config.notifications = true;
            await Notification.requestPermission();
            stopLoader();
        } else {
            config.notifications = false;
        }
        inpVerifyEmailRememberMe.checked ? config.rememberMe = true : config.rememberMe = false;
        // inpVerifyAllowFullscreen.checked ? config.fullscreen = true : config.fullscreen = false;
        inpVerifyEmailAllowFindMe.checked ? config.allowFindMe = true : config.allowFindMe = false;
        config.hue = 30;
        config.autoUpdate = 120000;
        config.audio = 1;
        confirmAccount(email, input, config);
    });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(?:\+?\d{1,3})?\d{5,}$/;

const createAccount = async (event) => {
    console.log("### => fn createAccount triggered");
    event.preventDefault();
    if (inpCreateAccountFirstName.value === "" || inpCreateAccountLastName.value === "" || inpCreateAccountEmail.value === "" || inpCreateAccountConfirmPassword.value === "") {
        showAlert(lang("please fill all mandatory fields", "Bitte alle Pflichtfelder ausfüllen"));
        return;
    }
    if (emailRegex.test(inpCreateAccountEmail.value) === false) {
        showAlert(lang("email has invalid format!", "E-Mail-Adresse hat kein gültiges Format"));
        return;
    }
    let phoneNumber = "";
    if (inpCreateAccountPhone.value != "") {
        phoneNumber = inpCreateAccountPhone.value.trim().replaceAll(" ", "").replaceAll("/", "").replaceAll("-", "");
        if (phoneRegex.test(phoneNumber) === false) {
            showAlert(lang("phone number has invalid format!", "Telefonnummer hat kein gültiges Format"));
            return;
        }
    }
    if (inpCreateAccountPassword.value.length < 8) {
        inpCreateAccountPassword.value = "";
        showAlert(lang("password must have a minimum length of 8 characters", "Das Passwort muss aus mindestens 8 Zeichen bestehen"));
        return;
    }
    if (inpCreateAccountPassword.value.includes(" ")) {
        inpCreateAccountPassword.value = "";
        showAlert(lang("password must not contain spaces", "Das Passwort darf keine Leerzeichen enthalten"));
        return;
    }
    if (inpCreateAccountPassword.value.length > 100) {
        inpCreateAccountPassword.value = "";
        showAlert(lang("password too long", "Passwort zu lang"));
        return;
    }
    if (inpCreateAccountPassword.value != inpCreateAccountConfirmPassword.value) {
        inpCreateAccountPassword.value = "";
        inpCreateAccountConfirmPassword.value = "";
        showAlert(lang("passwords do not match!", "Die Passwörter stimmen nicht überein"));
        return;
    }
    startLoader();
    let id = `user_${Date.now()}_${randomCyphers(10)}`;
    let data = {
        id,
        password: inpCreateAccountPassword.value,
        config: {},
        active: [[Date.now(), id, true]],
        firstName: [[Date.now(), id, sanitize(inpCreateAccountFirstName.value.trim().substring(0, 100))]],
        lastName: [[Date.now(), id, sanitize(inpCreateAccountLastName.value.trim().substring(0, 100))]],
        userName: [[Date.now(), id, sanitize(inpCreateAccountUserName.value.trim().substring(0, 100))]],
        email: [[Date.now(), id, inpCreateAccountEmail.value.trim().substring(0, 100)]],
        phone: [[Date.now(), id, phoneNumber.substring(0, 100)]],
        profilePix: [],
        about: [],
        chatPartners: ["user_1_tickerTeam"],
        chats: []
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch("/ticker.createAccount", options);
    let serverResponse = await response.json();
    let status = serverResponse.status;
    console.log({ status });
    if (status != "OK") {
        stopLoader();
        showAlert(status);
        return;
    } else {
        stopLoader();
        verifyEmail(data.email.at(-1)[2]);
    }
}

const renderModalCreateAccount = () => {
    console.log("### => fn renderModalCreateAccount triggered");
    showModal();
    modal.innerHTML = `
        <div class="text-align-center">
            <img src="pix/logo_wide.webp" alt="icon person" class="logo-wide">
            <h3>${lang("Create Account", "Benutzerkonto anlegen")}</h3>
            <hr>
            <form id="frmCreateAccount">
                <input type="text" id="inpCreateAccountFirstName" placeholder="${lang("first name *", "Vorname *")}" maxlength="100"><br>
                <input type="text" id="inpCreateAccountLastName" placeholder="${lang("last name *", "Nachname *")}" maxlength="100"><br>
                <input type="text" id="inpCreateAccountUserName" placeholder="${lang("user name (optional)", "Nutzername (optional)")}" maxlength="100"><br>
                <input type="email" id="inpCreateAccountEmail" placeholder="${lang("email *", "E-Mail-Adresse *")}" maxlength="100"><br>
                <input type="tel" id="inpCreateAccountPhone" placeholder="${lang("phone number (optional)", "Telefonnummer (optional)")}" maxlength="100"><br>
                <input type="password" id="inpCreateAccountPassword" placeholder="${lang("password *", "Passwort *")}" maxlength="100"><br>
                <input type="password" id="inpCreateAccountConfirmPassword" placeholder="${lang("confirm password *", "Passwort wiederholen *")}" maxlength="100"><br>
                <p class="small">${lang("* mandatory", "* Pflichtfelder")}
                <hr>
                <button type="button" onclick="dismiss()">${lang("dismiss", "abbrechen")}</button>
                <button type="submit" onclick="createAccount(event)">${lang("create account", "Konto anlegen")}</button>
            </form>
            <div class="camouflage"></div>
        </div>
    `;
    document.querySelector("#inpCreateAccountFirstName").focus();
}

const applyConfig = () => {
    console.log("### => fn applyConfig triggered");

    toggleMode(currentUser.config.mode, "applyConfig");

    if (config.hue !== currentUser.config.hue) {
        document.body.classList.remove(`hue${config.hue}`);
        document.body.classList.add(`hue${currentUser.config.hue}`);
        inpColor.value = currentUser.config.hue;
        colorValue.innerHTML = currentUser.config.hue;
    }

    let interval = currentUser.config?.autoUpdate || 120000;
    clearInterval(intervalId);
    intervalId = setInterval(checkForNewMessages, interval);
    inpUpdateInterval.value = interval / 60000;
    pUpdateInterval.innerHTML = interval / 60000;

    if (currentUser.config.language != config.language) {
        toggleLanguage(currentUser.config.language, "applyConfig");
        config = currentUser.config.language;
    }

    if (currentUser.config.rememberMe === true) {
        localStorageObject = {
            id: currentUser.id,
            rememberMe: true
        };
        localStorage.setItem("tickerConfig", JSON.stringify(localStorageObject));
    } else if (currentUser.config.rememberMe === false) {
        localStorageObject = {};
        localStorage.setItem("tickerConfig", JSON.stringify(localStorageObject));
    }

    if (currentUser.config.audio === 0) {
        inpAudio.value = "0";
		inpAudio.classList.remove("switch-active");
	} else {
        inpAudio.value = "1";
		inpAudio.classList.add("switch-active");
	}

    /* if (currentUser.config.fullscreen === true) {
        openFullscreen("applyConfig");
    } else if (currentUser.config.fullscreen === false) {
        closeFullscreen("applyConfig");
    } else {
        console.warn("Fullscreen configuration is not set.");
    } */

    // timestamps for welcome chat
    const registrationTimestamp = currentUser.firstName[0][0];
    const t1 = document.querySelector("#t1");
    const t2 = document.querySelector("#t2");
    const t3 = document.querySelector("#t3");
    const t4 = document.querySelector("#t4");
    const t5 = document.querySelector("#t5");
    const t6 = document.querySelector("#t6");
    if (t1) t1.innerHTML = dateAndTimeToString(registrationTimestamp);
    if (t2) t2.innerHTML = dateAndTimeToString(registrationTimestamp + 60000);
    if (t3) t3.innerHTML = dateAndTimeToString(registrationTimestamp + 120000);
    if (t4) t4.innerHTML = dateAndTimeToString(registrationTimestamp + 180000);
    if (t5) t5.innerHTML = dateAndTimeToString(registrationTimestamp + 240000);
    if (t6) t6.innerHTML = dateAndTimeToString(registrationTimestamp + 300000);
    
    config = currentUser.config;    // must stay in last line!
}

const homeItems = document.querySelectorAll(".home-item");
const closeHome = () => {
    homeItems.forEach(e => {
        e.style.display = "none";
    });
}

const login = async (event) => {
    console.log("### => fn login triggered");
    event.preventDefault();
    const frmLogin = document.querySelector("#frmLogin");
    const inpLoginEmail = document.querySelector("#inpLoginEmail");
    const inpLoginPassword = document.querySelector("#inpLoginPassword");
    const inpLoginRememberMe = document.querySelector("#inpLoginRememberMe");
    inpLoginRememberMe.checked ? config.rememberMe = true : config.rememberMe = false;
    if (emailRegex.test(inpLoginEmail.value) === false) {
        showAlert(lang("email format is not correct", "E-Mail-Format ist nicht korrekt"));
        return;
    }
    if (inpLoginEmail.value === "" || inpLoginPassword.value === "") {
        showAlert(lang("please fill all fields", "Bitte alle Felder ausfüllen"));
        return;
    }
    startLoader();
    let data = {
        email: inpLoginEmail.value,
        password: inpLoginPassword.value,
        rememberMe : config.rememberMe
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch("/ticker.login", options);
    let serverResponse = await response.json();
    let status = serverResponse.status;
    console.log({ status });
    stopLoader();
    if (serverResponse.status != "OK") {
        showAlert(status);
        frmLogin.reset();
        return;
    }
    currentUser = serverResponse.data;
    console.log({ currentUser });
    if (inpLoginRememberMe.checked) {
        localStorageObject = {
            id: currentUser.id,
            rememberMe: true
        }
        localStorage.setItem("tickerConfig", JSON.stringify(localStorageObject));
    }
    frmLogin.reset();
    closeModal();
    closeHome();
    logoHeader.style.display = "block";
    imgOverviewHeaderPlus.style.display = "block";
    imgOverviewHeaderUpdate.style.display = "block";
    menuPersonal.style.display = "block";
    pLoggedInUser.innerHTML = currentUser.email.at(-1)[2];
    applyConfig();    
    await getConnectedUsers(); 
    await getChats();
    renderOverview();
    if (window.innerWidth > 1024 && chats.length > 0) {
		renderChat(chats.at(-1).id);
	}
}

const forgotPassword = async (event) => {
    event.preventDefault();
    console.log("### => fn forgotPassword triggered");
    console.time("forgotPassword");
    const inpLoginEmail = document.querySelector("#inpLoginEmail");
    if (inpLoginEmail.value === "") {
        showAlert(lang("Please fill the email field", "Gib bitte eine E-Mail-Adresse an"));
        return;
    }
    startLoader();
    let data = {
        email: inpLoginEmail.value
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch("/ticker.forgotPassword", options);
    let serverResponse = await response.json();
    let status = serverResponse.status;
    console.log({ status });
    stopLoader();
    if (serverResponse.status != "OK") {
        showAlert(status);
        frmLogin.reset();
        return;
    }
    showAlert(lang("Your password has been reset.<br>Please check your emails.", "Dein Passwort wurde zurückgesetzt.<br>Bitte überprüfe deine E-Mails."), 10000);
    frmLogin.reset();
    console.timeEnd("forgotPassword");
}

const renderModalLogin = () => {
    console.log("### => fn renderModalLogin triggered");
    showModal();
    modal.innerHTML = `
    <div class="text-align-center">
        <img src="pix/logo_wide.webp" alt="icon person" class="logo-wide">
        <h3>${lang("Log in", "Anmelden")}</h3>
        <hr>
        <form id="frmLogin">
            <input type="email" id="inpLoginEmail" placeholder="${lang("email *", "E-Mail-Adresse *")}" maxlength="100"><br>
            <input type="password" id="inpLoginPassword" placeholder="${lang("password *", "Passwort *")}" maxlength="100">
            <p><input type="checkbox" id="inpLoginRememberMe"><label for="inpLoginRememberMe">${lang('Remember me in this browser on this device', 'In diesem Browser auf diesem Gerät angemeldet bleiben')}</p>
            <hr>
            <button type="button" onclick="dismiss()">${lang("dismiss", "abbrechen")}</button>
            <button type="submit" onclick="login(event)">${lang("log in", "anmelden")}</button><br><br>
            <p class="small"><a href="" onclick="forgotPassword(event)">${lang("I forgot my password", "Ich habe mein Passwort vergessen")}</a></p>
        </form>
        <div class="camouflage"></div>
    </div>
    `;
    const inpLoginEmail = document.querySelector("#inpLoginEmail");
    inpLoginEmail.focus();
}

const quickLogin = async (id) => {
    console.log("### => fn quickLogin triggered");
    startLoader();
    let data = {
        id
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch("/ticker.quickLogin", options);
    let serverResponse = await response.json();
    let status = serverResponse.status;
    console.log({ status });
    stopLoader();
    if (status != "OK") {
        showAlert(status);
        renderModalLogin();
        return;
    }
    currentUser = serverResponse.data;
    console.log({ currentUser });
    closeHome();
    logoHeader.style.display = "block";
    imgOverviewHeaderPlus.style.display = "block";
    imgOverviewHeaderUpdate.style.display = "block";
    menuPersonal.style.display = "block";
    pLoggedInUser.innerHTML = currentUser.email.at(-1)[2];
    applyConfig();
    await getConnectedUsers(); 
    await getChats();
    renderOverview();
    if (window.innerWidth > 1024 && chats.length > 0) {
        renderChat(chats.at(-1).id);
    }
}

const getUser = async () => {
    console.log("### => fn getUser triggered");
    console.time("getUser");
    // startLoader();
    let data = {
        id: currentUser.id
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch("/ticker.getUser", options);
    let serverResponse = await response.json();
    let status = serverResponse.status;
    console.log({ status });
    // stopLoader();
    if (status != "OK") {
        showAlert(status);
        console.timeEnd("getUser");
        return;
    }
    currentUser = serverResponse.data;
    console.log({ currentUser });
    console.timeEnd("getUser");
}

const logout = () => {
    console.log("### => fn logout triggered");
    localStorageObject = {};
    localStorage.setItem("tickerConfig", JSON.stringify(localStorageObject));
    currentUser = {};
    pLoggedInUser.innerHTML = "";
    chats = [];
    window.location.reload();
}

const editPersonalData = async (event) => {
    console.log("### => fn editPersonalData triggered");
    console.time("editPersonalData");
    event.preventDefault();

    const inpEditPersonalDataFirstName = document.querySelector("#inpEditPersonalDataFirstName");
    const inpEditPersonalDataLastName = document.querySelector("#inpEditPersonalDataLastName");
    const inpEditPersonalDataUserName = document.querySelector("#inpEditPersonalDataUserName");
    const inpEditPersonalDataEmail = document.querySelector("#inpEditPersonalDataEmail");
    const inpEditPersonalDataPhone = document.querySelector("#inpEditPersonalDataPhone");
    const inpEditPersonalDataOldPassword = document.querySelector("#inpEditPersonalDataOldPassword");
    const inpEditPersonalDataNewPassword = document.querySelector("#inpEditPersonalDataNewPassword");
    const inpEditPersonalDataConfirmPassword = document.querySelector("#inpEditPersonalDataConfirmPassword");
    const inpEditPersonalDataNotifications = document.querySelector("#inpEditPersonalDataNotifications");
    const inpEditPersonalDataRememberMe = document.querySelector("#inpEditPersonalDataRememberMe");
    const inpEditPersonalDataFullscreen = document.querySelector("#inpEditPersonalDataFullscreen");
    const inpEditPersonalDataFindMe = document.querySelector("#inpEditPersonalDataFindMe");

    if (inpEditPersonalDataFirstName.value === currentUser.firstName.at(-1)[2] 
    && inpEditPersonalDataLastName.value === currentUser.lastName.at(-1)[2] 
    && inpEditPersonalDataUserName.value === currentUser.userName.at(-1)[2] 
    && inpEditPersonalDataEmail.value === currentUser.email.at(-1)[2] 
    && inpEditPersonalDataPhone.value === currentUser.phone.at(-1)[2] 
    && inpEditPersonalDataNotifications.checked === currentUser.config.notifications 
    && inpEditPersonalDataRememberMe.checked === currentUser.config.rememberMe 
    && inpEditPersonalDataFullscreen.checked === currentUser.config.fullscreen 
    && inpEditPersonalDataFindMe.checked === currentUser.config.allowFindMe 
    && inpEditPersonalDataNewPassword.value === "") {
        showAlert(lang("No changes made!", "Keine Änderungen vorgenommen!"));
        return;
    }
    if (emailRegex.test(inpEditPersonalDataEmail.value) === false) {
        showAlert(lang("email has invalid format!", "E-Mail-Adresse hat kein gültiges Format"));
        return;
    }
    let phoneNumber = "";
    if (inpEditPersonalDataPhone.value != "") {
        phoneNumber = inpEditPersonalDataPhone.value.trim().replaceAll(" ", "").replaceAll("/", "").replaceAll("-", "");
        if (phoneRegex.test(phoneNumber) === false) {
            showAlert(lang("phone number has invalid format!", "Telefonnummer hat kein gültiges Format"));
            return;
        }
    }
    if (inpEditPersonalDataNewPassword.value != "" && inpEditPersonalDataNewPassword.value.length < 8) {
        inpEditPersonalDataNewPassword.value = "";
        inpEditPersonalDataConfirmPassword.value = "";
        showAlert(lang("password must have a minimum length of 8 characters", "Das Passwort muss aus mindestens 8 Zeichen bestehen"));
        return;
    }
    if (inpEditPersonalDataNewPassword.value != "" && inpEditPersonalDataNewPassword.value.includes(" ")) {
        inpEditPersonalDataNewPassword.value = "";
        inpEditPersonalDataConfirmPassword.value = "";
        showAlert(lang("password must not contain spaces", "Das Passwort darf keine Leerzeichen enthalten"));
        return;
    }
    if (inpEditPersonalDataNewPassword.value != "" && inpEditPersonalDataNewPassword.value.length > 100) {
        inpEditPersonalDataNewPassword.value = "";
        inpEditPersonalDataConfirmPassword.value = "";
        showAlert(lang("password too long", "Passwort zu lang"));
        return;
    }
    if (inpEditPersonalDataNewPassword.value != inpEditPersonalDataConfirmPassword.value) {
        inpEditPersonalDataNewPassword.value = "";
        inpEditPersonalDataConfirmPassword.value = "";
        showAlert(lang("passwords do not match!", "Die Passwörter stimmen nicht überein"));
        return;
    }
    if (inpEditPersonalDataNewPassword.value != "" && inpEditPersonalDataOldPassword === "") {
        showAlert(lang("please fill the old password field", "Bitte auch das alte Passwort angeben"));
        inpEditPersonalDataOldPassword.focus();
        return;
    }

    startLoader();

    let data = {};
    let clonedCurrentUser = JSON.parse(JSON.stringify(currentUser));

    if (inpEditPersonalDataFirstName.value != clonedCurrentUser.firstName.at(-1)[2]) {
        clonedCurrentUser.firstName.push([Date.now(), clonedCurrentUser.id, sanitize(inpEditPersonalDataFirstName.value)])
    }
    if (inpEditPersonalDataLastName.value != clonedCurrentUser.lastName.at(-1)[2]) {
        clonedCurrentUser.lastName.push([Date.now(), clonedCurrentUser.id, sanitize(inpEditPersonalDataLastName.value)])
    }
    if (inpEditPersonalDataUserName.value != clonedCurrentUser.userName.at(-1)[2]) {
        clonedCurrentUser.userName.push([Date.now(), clonedCurrentUser.id, sanitize(inpEditPersonalDataUserName.value)])
    }
    if (inpEditPersonalDataEmail.value != clonedCurrentUser.email.at(-1)[2]) {
        clonedCurrentUser.email.push([Date.now(), clonedCurrentUser.id, inpEditPersonalDataEmail.value])
    }
    if (inpEditPersonalDataPhone.value != clonedCurrentUser.phone.at(-1)[2]) {
        clonedCurrentUser.phone.push([Date.now(), clonedCurrentUser.id, inpEditPersonalDataPhone.value])
    }
    if (currentUser.config.notifications === false && inpEditPersonalDataNotifications.checked) {
        await Notification.requestPermission();
    } else if (currentUser.config.notifications === true && !inpEditPersonalDataNotifications.checked) {
        showAlert(lang("Please revoke the notification permission for <i>app.fablog/eu</i> in the browser settings", "Bitte ändere die Benachrichtigungseinstellungen für <i>app.fablog/eu</i> in deinem Browser"), 6000);
    }
    clonedCurrentUser.config.notifications = inpEditPersonalDataNotifications.checked;
    clonedCurrentUser.config.rememberMe = inpEditPersonalDataRememberMe.checked;
    clonedCurrentUser.config.fullscreen = inpEditPersonalDataFullscreen.checked;
    clonedCurrentUser.config.allowFindMe = inpEditPersonalDataFindMe.checked;

    if (inpEditPersonalDataNewPassword.value != "") {
        data.oldPassword = inpEditPersonalDataOldPassword.value;
        data.newPassword = inpEditPersonalDataNewPassword.value
    }
    data.user = clonedCurrentUser;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch("/ticker.editPersonalData", options);
    const serverResponse = await response.json();
    stopLoader();
    if (serverResponse.status != "OK") {
        showAlert(serverResponse.status);
        inpEditPersonalDataOldPassword.value = "";
        inpEditPersonalDataNewPassword.value = "";
        inpEditPersonalDataConfirmPassword.value = "";
        return;
    }
    // if (serverResponse.alert) { showAlert(serverResponse.alert) };
    currentUser = serverResponse.data;
    closeAllModals();
    showHeaderIcons();
    applyConfig();
    console.timeEnd("editPersonalData");
}

const updateUserSilent = async () => {
    console.log("### => fn updateUserSilent triggered");
    console.time("updateUserSilent");
    let data = currentUser;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch("/ticker.updateUserSilent", options);
    const serverResponse = await response.json();
    stopLoader();
    if (serverResponse.status != "OK") {
        showAlert(serverResponse.status);
        return;
    }
    currentUser = serverResponse.data;
    applyConfig();
    console.timeEnd("updateUserSilent");
}

const renderModalEditPersonalData = () => {
    console.log("### => fn renderModalEditPersonalData triggered");
    showModal();
    hideHeaderIcons();
    modal.innerHTML = `
        <img src="pix/x.webp" alt="close" title="close" class="close-modal icon" onclick="closeModal(); showHeaderIcons()">
        <br><div class="personal-label" style="border: 3px solid hsl(${currentUser.config.hue}, 25%, 50%);">
            <div class="morse-container first-row">${translateToMorse(currentUser.firstName.at(-1)[2].substring(0, 1))}</div>
            <div class="morse-container">${translateToMorse(currentUser.lastName.at(-1)[2].substring(0, 1))}</div>
        </div>
        <h3>${lang("Edit Personal Data", "Persönliche Daten ändern")}</h3>
        <hr>
        <form id="frmEditPersonalData">
            <input type="text" id="inpEditPersonalDataFirstName" placeholder="${lang("first name", "Vorname")}" maxlength="100"><br>
            <input type="text" id="inpEditPersonalDataLastName" placeholder="${lang("last name", "Nachname")}" maxlength="100"><br>
            <input type="text" id="inpEditPersonalDataUserName" placeholder="${lang("user name", "Nutzername")}" maxlength="100"><br>
            <input type="email" id="inpEditPersonalDataEmail" placeholder="${lang("email", "E-Mail-Adresse")}" maxlength="100">*<br>
            <input type="tel" id="inpEditPersonalDataPhone" placeholder="${lang("phone number", "Telefonnummer")}" maxlength="100">
            <p class="small">${lang('* In case you change your email address here, you will need to use the new email address for logging in', '* Wenn du deine E-Mail-Adresse hier änderst, musst du dich ab jetzt mit der neuen E-Mail-Adresse anmelden.')}</p>
            <hr>
            <h4>${lang('Change Password', 'Passwort ändern')}</h4>
            <input type="password" id="inpEditPersonalDataOldPassword" placeholder="${lang("old password", "Altes Passwort")}" maxlength="100"><br><br>
            <input type="password" id="inpEditPersonalDataNewPassword" placeholder="${lang("new password", "Neues Passwort")}" maxlength="100"><br>
            <input type="password" id="inpEditPersonalDataConfirmPassword" placeholder="${lang("confirm new password", "Neues Passwort bestätigen")}" maxlength="100"><br>
            <hr>
            <h4>${lang("Permissions", "Berechtigungen")}</h4>
            <p>
                <input type="checkbox" id="inpEditPersonalDataNotifications">
                <label for="inpEditPersonalDataNotifications">${lang('Allow notifications (recommended)', 'Benachrichtigungen erlauben (empfohlen)')}</label>
            </p>
            <p>
                <input type="checkbox" id="inpEditPersonalDataRememberMe">
                <label for="inpEditPersonalDataRememberMe">${lang('Remember me in this browser', 'In diesem Browser angemeldet bleiben')}</label>
            </p>
            <p>
                <input type="checkbox" id="inpEditPersonalDataFindMe">
                <label for="inpEditPersonalDataFindMe">${lang('Allow ticker users to find you (by your name, user name, or email)', 'Anderen ticker-NutzerInnen erlauben, dich zu finden (über deinen Namen, Nutzernamen oder deine E-Mail-Adresse)')}</label>
            </p>
            <hr>
            <button type="button" onclick="dismiss()">${lang("dismiss", "abbrechen")}</button>
            <button type="submit" onclick="editPersonalData(event)">${lang("submit", "ändern")}</button>
        </form>
        <div class="camouflage"></div>
    `;
    // formerly included:
        /* <p>
            <input type="checkbox" id="inpEditPersonalDataFullscreen">
            <label for="inpEditPersonalDataFullscreen">${lang('Allow fullscreen mode (recommended for smartphones)', 'Vollbild-Modus erlauben (empfohlen für Smartphones)')}</label>
        </p> */
    document.querySelector("#inpEditPersonalDataFirstName").value = currentUser.firstName.at(-1)[2];
    document.querySelector("#inpEditPersonalDataLastName").value = currentUser.lastName.at(-1)[2];
    document.querySelector("#inpEditPersonalDataUserName").value = currentUser.userName.at(-1)[2];
    document.querySelector("#inpEditPersonalDataEmail").value = currentUser.email.at(-1)[2];
    document.querySelector("#inpEditPersonalDataPhone").value = currentUser.phone.at(-1)[2];
    document.querySelector("#inpEditPersonalDataNotifications").checked = currentUser.config.notifications;
    document.querySelector("#inpEditPersonalDataRememberMe").checked = currentUser.config.rememberMe;
    document.querySelector("#inpEditPersonalDataFullscreen").checked = currentUser.config.fullscreen;
    document.querySelector("#inpEditPersonalDataFindMe").checked = currentUser.config.allowFindMe;
}

const deleteAccount = async (event) => {
    console.log("### => fn deleteAccount triggered");
    event.preventDefault();
    const inpConfirmDeleteAccountPassword = document.querySelector("#inpConfirmDeleteAccountPassword");
    if (inpConfirmDeleteAccountPassword.value === "") {
        showAlert(lang("please enter your password", "Bitte gib dein Passwort ein"));
        return;
    }
    startLoader();
    let data = {
        id: currentUser.id,
        password: inpConfirmDeleteAccountPassword.value
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch("/ticker.deleteAccount", options);
    let serverResponse = await response.json();
    let status = serverResponse.status;
    stopLoader();
    if (status != "OK") {
        inpConfirmDeleteAccountPassword.value = "";
        showAlert(status);
        return;
    }
    showAlert(lang("account successfully deleted", "Konto erfolgreich gelöscht"));
    console.log("account deleted: " + serverResponse.id + " " + status);
    closeModal();
    logout();
    setTimeout(() => {
        window.location.reload();
    }, 3000);
}

const renderModalConfirmDeleteAccount = () => {
    showModal();
    modal.innerHTML = `
        <h3 style="color: var(--accent-orange); text-decoration: underline;">${lang('Warning!', 'Warnung!')}</h3>
        <p>${lang('This will entirely and permanently delete your account without the possibility to restore it.', 'Das wird dein Nutzerkonto gänzlich und dauerhaft löschen ohne eine Möglichkeit es wiederherzustellen.')}</p>
        <p>${lang('Messages you sent will still be visible for other users but not your name', 'Nachrichten, die du geschrieben hast, werden weiter für andere NutzerInnen sichtbar sein, dein Name jedoch nicht.')}</p>
        <form>
            <input type="password" id="inpConfirmDeleteAccountPassword" placeholder="${lang('password', 'Passwort')}">
            <p>${lang('Please enter your password to confirm the deletion of your account.', 'Bitte gib dein Passwort ein, um die Löschung deines Kontos zu bestätigen.')}</p>
            <hr>
            <button type="button" onclick="dismiss()">${lang("dismiss", "abbrechen")}</button>
            <button type="submit" onclick="deleteAccount(event)">${lang("delete account", "Konto löschen")}</button>
        </form>
        <div class="camouflage"></div>
    `
}

const getConnectedUsers = async () => {
    console.log("### => fn getConnectedUsers triggered");
    console.time("getConnectedUsers");
    /* let chatPartners = currentUser.chatPartners;
    if (chatPartners.length === 0) return; */
    // startLoader();
    let data = {
        id: currentUser.id
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch("/ticker.getConnectedUsers", options);
    let serverResponse = await response.json();
    let status = serverResponse.status;
    // stopLoader();
    if (status != "OK") {
        showAlert(status);
        console.timeEnd("getConnectedUsers");
        return;
    }
    console.log({ status });
    connectedUsers = serverResponse.data;
    console.timeEnd("getConnectedUsers");
}

const checkLocalStorage = () => {
    console.log("### => fn checkLocalStorage triggered");
    if (!localStorage.getItem("tickerConfig")) {
        return;
    } else {
        let tickerConfig = JSON.parse(localStorage.getItem("tickerConfig"));
        if (tickerConfig.id) {
            quickLogin(tickerConfig.id)
        } else {
        return;
        }
    }
}

const startApp = () => {
    console.log("### => fn startApp triggered");
    checkLocalStorage();
    if (!currentUser.id) {
        hideHeaderIcons();
        showHome();
    }
    /* if (Object.keys(currentUser).length === 0) {
        hideHeaderIcons();
        showHome();
    } */
}

startApp();