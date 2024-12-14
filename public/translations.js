// ############
// ### MENU ###
// ############

// config.language = 1;


const langPicker = (id, english, german) => {
    const translations = [english, german];
    if (document.querySelector(`#${id}`)) {
        document.querySelector(`#${id}`).innerHTML = translations[config.language];
    }    
}

const toggleLanguage = (code, triggerSource) => {
    config.language = code;
    // Use simple quotes only!
    langPicker('strMenuH3Language', 'Language', 'Sprache');
    langPicker('strMenuH3AboutMe', 'Personal ticker', 'Persönlicher ticker');
    langPicker('strMenuPAboutMe', `Share your thoughts about what's up right now`, 'Schreib was dich gerade umtreibt');
    langPicker('strMenuBtnAboutMe', 'send', 'abschicken');
    langPicker('strMenuH3Color', 'Coloring', 'Farbgebung');
    langPicker('strMenuH3Mode', 'Mode', 'Modus');
    langPicker('strMenuBtnToggleDarkMode', 'dark', 'dunkel');
    langPicker('strMenuBtnToggleLightMode', 'light', 'hell');
    langPicker('strMenuH3Audio', 'Audio', 'Töne');
    langPicker('strMenuH3Profile', 'User Profile', 'Nutzerprofil');
    langPicker('strMenuBtnEditProfile', 'edit', 'anpassen');
    langPicker('strMenuBtnDeleteProfile', 'delete', 'löschen');
    langPicker('strMenuH3Logout', 'Log out from ticker', 'Von ticker abmelden');
    langPicker('strMenuBtnLogout', 'log out', 'abmenden');
    langPicker('strMenuH3Fullscreen', 'Fullscreen', 'Vollbild');
    langPicker('strMenuBtnTriggerFullscreen', 'on', 'ein');
    langPicker('strMenuBtnExitFullscreen', 'off', 'aus');
    langPicker('strMenuH3AutoUpdateInterval', 'Check for new messages', 'Neue Nachrichten abrufen');
    langPicker('strMenuPAutoUpdateInterval', 'Update interval (minutes)', 'Update-Intervall (in Minuten)');
    langPicker('strMenuH3AboutThisApp', 'About this App', 'Über diese App');
    langPicker('strMenuAboutThisApp', 
        '<p>ticker is a simple text messaging app which helps you stay in contact with your family, friends, and collegues. It is all plain and simple to use. No installation is needed. Updates automatically run in the background always providing you with the latest version.</p><p>Use it across all plattforms in your favourite browser. Due to its data base design ticker is always synchronized on all your devices.</p><p><b>Privacy</b></p><p>Besides using the secure https protocol for sending and receiving data, sensitive information is encrypted on the server in order to keep it safe. Data is never passed nor sold to any third party. There is no analytics taking place and no big tech company spies your data or analyses your behaviour.</p>', 
        '<p>ticker ist eine einfache Text-Nachrichten-App, die dir hilt mit deiner Familie, deinen Freundinnen oder Kollegen in Kontakt zu bleiben. Es funktioniert ganz einfach. Du musst nichts installieren. Updates finden automatisch im Hintergrund statt und versorgen dich immer mit der aktuellsten Version.</p><p>ticker läuft auf allen Betriebssystemen in deinem Lieblingsbrowser. Aufgrund seines Datenbank-Designs wird es immer auf all deinen Geräten synchronisiert.</p><p><b>Datenschutz</b></p><p>Wir senden alle Daten über das sichere https-Protokoll. Zusätzlich werden sensible Informationen auf dem Server verschlüsselt, um sie abzusichern. Deine Daten werden an niemanden weitergegeben, nicht verkauft, es finden keine Datenanalysen statt und keine Big-Tech-Firma hat Einblick in deine Daten oder wertet dein Verhalten aus.</p>');
    langPicker('strMenuPLoggedInUser', 'You are currently logged in as', 'Du bist angemeldet als');
    langPicker('strMenuPVersion', 'version', 'Version');
    langPicker('strHomeH3', 'Esay messaging', 'Einfach plaudern');
    langPicker('strHomeP1', 
        'Have your chats always and everyehere. On your smartphone, your tablet, and your PC.<br><br>No installation required. Simply run <i><b>ticker</b></i> in your favourite browser.', 
        'Hab deine Chats immer dabei. Auf dem Smartphone, dem Tablet oder am PC.<br><br>Keine Installation notwendig. <i><b>ticker</b></i> läuft einfach in deinem Lieblingsbrowser.');
    langPicker('strHomeP2', 
        'And if you are into morsing you can even send messages as morse code', 
        'Und wenn du ein Morse-fan bist, kannst du deine Nachrichten sogar als Morse-Code verschicken'
    );
    langPicker('strHomeH3_2', 'ticker and morse', 'tickern und morsen');
    langPicker('strHomeP_1', 
        `Back in the eighteen-fifties morsing a signal from a distant place to another was a revolutionary invention. Today, we are used to getting news instantly. We wanted to keep the memory of this legendary technique alive and give you the opportunity to play around with it. <br>It's fun! <br>But, of course, you can use ticker just to write conventional messages.`,
        'In den 1850er Jahren war es eine revolutionäre Erfindung als man plötzlich Signale zu entfernten Orten morsen konnte. Heute sind wir es gewöhnt, Nachrichten in Echtzeit zu bekommen. Wir wollten die Erinnerung an diese legendäre Technik bewahren und euch die Möglichkeit geben, damit herumzuspielen. <br>Es macht Spaß! <br>Aber natürlich kann man mit ticker auch einfach nur wie gewohnt Nachrichten schreiben.'
    );
    langPicker('strHomeH4', 'No profile pictures?', 'Keine Profilbilder?');
    langPicker('strHomeP_2', 
        `Sometimes it's good to do something differently. So, no, there are no profile pictures but a label with your initials as morse signals in the coloring you chose for your app style. Cool, isn't it?`, 
        'Manchmal muss man etwas anders machen. Also nein, es gibt keine Profilbilder sondern Stempel mit euren Initialen als Morsezeichen in der Farbe, die ihr als App-Style gewählt habt. Cool, oder?')
    langPicker('btnCreateAccount', 'sign up', 'registrieren');
    langPicker('btnLogin', 'log in', 'anmelden');
    langPicker('strWelcomeNew', 'new to ticker?', 'neu bei ticker?');
    langPicker('strWelcomeMember', 'have an account?', 'schon ein Konto?');
    // langPicker('strWelcomeP0', 'Welcome to <i><b>ticker</b></i>', 'Willkommen bei <i><b>ticker</b></i>');
    langPicker('strWelcomeH3', 'Getting started', `Los geht's!`);
    langPicker('strWelcomeP1', 'Welcome to ticker! 👋', 'Willkommen bei ticker! 👋');
    langPicker('strWelcomeP2', 'So, what is this all about?', 'Also, wie läuft das jetzt hier?');
    langPicker('strWelcomeP3', 
        'Start by adding your first chat. <br>Simply click or tap on the <img src="pix/plus.webp" class="in-text-icon"> plus icon above.', 
        'Beginne mit deiner ersten Unterhaltung. <br>Klicke oder tippe einfach oben auf das <img src="pix/plus.webp" class="in-text-icon"> Pluszeichen.');
    langPicker('strWelcomeP4', 
        'In the <img src="pix/burger.webp" class="in-text-icon"> settings menu you find lots of options to customize ticker to your needs and favours.', 
        'In den <img src="pix/burger.webp" class="in-text-icon"> Einstellungen findest du eine Menge Möglichkeiten, ticker nach deinen Bedürfnissen anzupassen.');
    langPicker('strWelcomeP5', 
        `By the way 💡, adding <i>[morse]</i> to the end of a message translates your words to morse code. Give it a try. It's fun!`,
        `Übrigens 💡, wenn du am Ende einer Nachricht <i>[morse]</i> schreibst, wird dein Text in Morse-Code übersetzt. Probier's mal aus. Es macht Spaß!`);
    langPicker('strWelcomePMe', 'me', 'Ich');
    langPicker('strWelcomePMe2', 'me', 'Ich');

    config.language = code;
    if (!triggerSource && currentUser.id) {
        currentUser.config.language = code;
        updateUserSilent();
    }
}

toggleLanguage(config.language, "self");
