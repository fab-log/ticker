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
    langPicker('strMenuPAutoUpdateInterval_1', 'Update interval: ', 'Update-Intervall: ');
    langPicker('strMenuPAutoUpdateInterval_2', ' minute(s)', ' Minute(n)');
    langPicker('strMenuH3AboutThisApp', 'About this App', 'Über diese App');
    langPicker('strMenuAboutThisApp', 
        '<p>ticker is a simple text messaging app which helps you stay in contact with your family, friends, and collegues. It is all plain and simple to use. No installation is needed. Updates automatically run in the background always providing you with the latest version.</p><p>Use it across all plattforms in your favourite browser. Due to its data base design ticker is always synchronized on all your devices.</p><p><b>Privacy</b></p><p>Besides using the secure https protocol for sending and receiving data, sensitive information is encrypted on the server in order to keep it safe. Data is never passed nor sold to any third party. There is no analytics taking place and no big tech company spies your data or analyses your behaviour.</p>', 
        '<p>ticker ist eine einfache Text-Nachrichten-App, die dir hilt mit deiner Familie, deinen Freundinnen oder Kollegen in Kontakt zu bleiben. Es funktioniert ganz einfach. Du musst nichts installieren. Updates finden automatisch im Hintergrund statt und versorgen dich immer mit der aktuellsten Version.</p><p>ticker läuft auf allen Betriebssystemen in deinem Lieblingsbrowser. Aufgrund seines Datenbank-Designs wird es immer auf all deinen Geräten synchronisiert.</p><p><b>Datenschutz</b></p><p>Wir senden alle Daten über das sichere https-Protokoll. Zusätzlich werden sensible Informationen auf dem Server verschlüsselt, um sie abzusichern. Deine Daten werden an niemanden weitergegeben, nicht verkauft, es finden keine Datenanalysen statt und keine Big-Tech-Firma hat Einblick in deine Daten oder wertet dein Verhalten aus.</p>');
    langPicker('strMenuPLoggedInUser', 'You are currently logged in as', 'Du bist angemeldet als');
    langPicker('strMenuPVersion', 'version', 'Version');
    langPicker('strHomeH3', 'Esay messaging', 'Einfach plaudern');
    langPicker('strHomeP1', 
        'Have your chats always and everyehere. On your smartphone, your tablet, and your PC.<br><br>No installation required. Simply run <i>ticker</i> in your favourite browser.', 
        'Hab deine Chats immer dabei. Auf dem Smartphone, dem Tablet oder am PC.<br><br>Keine Installation notwendig. <i>ticker</i> läuft einfach in deinem Lieblingsbrowser.');
    langPicker('strHomeP2', 
        'And if you are into morsing you can even send messages as morse code', 
        'Und wenn du ein Morse-Fan bist, kannst du deine Nachrichten sogar als Morse-Code verschicken'
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
        `For more detailed instructions just klick on the <b><i>ticker</i></b> logo above. <br>
        By the way 💡, adding <i>[morse]</i> to the end of a message translates your words to morse code. Give it a try. It's fun!`,
        `Für eine genauere Anleitung, klicke einfach oben auf das <b><i>ticker</i></b> Logo. <br>
        Übrigens 💡, wenn du am Ende einer Nachricht <i>[morse]</i> schreibst, wird dein Text in Morse-Code übersetzt. Probier's mal aus. Es macht Spaß!`);
    langPicker('strWelcomePMe', 'me', 'Ich');
    langPicker('strWelcomePMe2', 'me', 'Ich');
    // langPicker('strManual', manualEn, manualDe);

    config.language = code;
    if (!triggerSource && currentUser.id) {
        currentUser.config.language = code;
        updateUserSilent();
    }
}

const manualEn = `
<img src="pix/x.webp" alt="close" title="close" class="close-modal icon" onclick="closeModal()">

<h2>Instructions</h2>
<hr>

<h3>Contacts</h3>

<p><b>Search for Contacts</b><br>
Click on the plus sign at the top. Here, you can check if your friends are already on <i>ticker</i> by entering a name, username, or email address in the search field. If there are results, you can select the corresponding name and start chatting immediately.</p>

<p><b>Invite via Email</b><br>
You can invite friends who are not yet on <i>ticker</i> by sending them a message with a link to <i>ticker</i>.</p>
<p><b>Groups</b><br>
Once you have two or more contacts, you can start a group chat. Give the group a name and select the contacts from the list that you want to include in the group. Finally, you can choose a group color.</p>
<hr>

<h3>Messages</h3>

<p><b>Sending messages</b><br>
Select a chat by clicking or tapping on it to enter the chat. Write a message in the input field. Use the triangular arrow to the right to send the message.<br>
In case you like the encryption you can add <i>[morse]</i> to the end of a message and it will be translated to morse code.</p>

<p><b>Editing and Deleting</b><br>
If you want to edit or delete a message, you can do so via the context menu. On a smartphone or tablet, press and hold the message until a window with the two options appears. On a PC, this can be done with a right-click.<br>
Note that you can only modify your own messages afterward.</p>

<p><b>Retrieving Messages</b><br>
As long as the browser window is open, <i>ticker</i> checks for new messages every two minutes.¹ However, you can also manually refresh messages by clicking/tapping the icon with the two circular arrows at the top. Additionally, you can adjust the automatic interval in the settings.</p>

<p class="small">¹ Depending on the device and settings, other factors such as power-saving mode or do-not-disturb mode may affect whether and how long <i>ticker</i> remains active in the background.</p>

<p><b>Learn more about your chat partners</b><br>
On top of the chat messages you find the name of your chat partner or the chat group. Klick or tap on that name to get more information about them.</p>
<hr>

<h3>Settings</h3>
<p><b>Language</b><br>
Here, you can select your preferred language. Currently, English and German are available.</p>

<p><b>Status</b><br>
Directly below, you can write something about yourself or what’s on your mind. This information is visible to your contacts. It remains until you delete it or replace it with something else.</p>

<p><b>Color Scheme</b><br>
This option allows you to influence the general appearance of the app. You determine the accent color, and <i>ticker</i> automatically selects other matching colors.<br>
This color will also be displayed to your contacts.</p>

<p><b>Mode</b><br>
Light or dark mode is often a matter of preference. Try out what works best for you. Generally, dark mode is suitable for darker environments or prolonged screen use, while light mode is recommended for bright surroundings.</p>

<p><b>Sounds</b><br>
When sending and receiving messages, <i>ticker</i> plays short notification sounds, which you can enable or disable here.</p>

<p><b>Fullscreen</b><br>
Choose fullscreen mode to hide browser tools like the address bar or tabs overview.</p>

<p><b>Update Interval</b><br>
Here, you can set how frequently messages are automatically retrieved. The value is specified in minutes.</p>

<p><b>User Profile</b><br>
You can change your user data, such as name and email address. If you want to adjust your password or permissions, you can do so here as well.
Please note that your contacts will always see you with your username (if provided) or your first and last name. They may also find you using this information. The email address specified here must be used for login.</p>
<p>Permissions</p>
<ul>
<li>Allow notifications<br>
Decide whether your device is allowed to display notifications.</li>
<li>Stay logged in on this browser<br>
With this option, you don’t need to log in every time you access <i>ticker</i>. This option is very convenient but should only be used on devices protected by PIN codes, facial recognition, etc. Once you explicitly log out, this setting will be reset.</li>
<li>Allow other <i>ticker</i> users to find you<br>
This is the only way you can be found on <i>ticker</i>. Other users can search for you using your first and last name, username, or email address.</li>
</ul>

<p><b>Log Out</b><br>
On devices used by multiple people, it may be advisable to log out after use. This ensures that no one can view your messages. To log back in, you will need your email address and password.</p>

<div class="camouflage"></div>
`

const manualDe = `
<img src="pix/x.webp" alt="close" title="close" class="close-modal icon" onclick="closeModal()">

<h2>Bedienung</h2>
<hr>

<h3>Kontakte</h3>

<p><b>Kontakte suchen</b><br>
Klicke auf das Pluszeichen oben. Hier kannst schauen, ob Freunde von dir schon bei <i>ticker</i> sind, indem du einen Namen, Nutzernamen oder eine E-Mail-Adresse in das Suchfeld eingibst. Falls es Ergebnisse gibt, kannst du den entsprechenden Namen auswählen und sofort beginnen zu chatten.</p>

<p><b>Per E-Mail einladen</b><br>
Freunde, die noch nicht bei <i>ticker</i> sind, kannst du einladen, indem du ihnen eine Nachricht mit einem Link zu <i>ticker</i> zukommen lässt.</p>

<p><b>Gruppen</b><br>
Sobald du zwei oder mehr Kontakte hast, kannst du einen Gruppenchat starten. Gib der Gruppe einen Namen und wähle diejenigen Kontakte aus der Liste, die du in die Gruppe aufnehmen möchtest. Schließlich kannst du noch eine Gruppenfarbe wählen</p>
<hr>

<h3>Nachrichten</h3>

<p><b>Nachrichten schicken</b><br>
Wähle einen Chat durch Anklicken oder Antippen aus, um in den Chat zu gelangen. Schreibe eine Nachricht in das Eingabefeld. Mit dem dreieckigen Pfeil rechts daneben schickst du die Nachricht ab.<br>
Für den Fall, dass du Geheimsprachen magst, kannst du <i>[morse]</i> ans Ende deiner Nachricht anfügen. Dann wird sie in den Morse-Code übersetzt.</p>

<p><b>Bearbeiten und Löschen</b><br>
Möchtest du eine Nachricht bearbeiten oder löschen, so geht das über das Kontextmenü. Auf dem Smartphone oder Tablet tippst du dazu lange auf die betreffende Nachricht bis ein Fenster mit den beiden Möglichkeiten erscheint. Am PC funktioniert das mit einem Rechtsklick.<br>
Beachte, dass du nur deine eigenen Nachrichten nachträglich verändern kannst.</p>

<p><b>Nachrichten abrufen</b><br>
Solange das Browserfenster geöffnet ist, prüft <i>ticker</i> alle zwei Minuten, ob neue Nachrichten vorliegen.¹ Du kannst die Nachrichten jedoch auch selbst aktualisieren, indem du oben auf das Symbol mit den beiden kreisförmigen Pfeilen klickst / tippst. Zusätzlich kannst du das automatische Intervall in den Einstellungen anpassen.</p>
<p class="small">¹ Je nach Gerät und Einstellungen beeinflussen andere Faktoren wie Energiesparmodus oder Nicht-Stören-Modus, ob und wie lange <i>ticker</i> im Hintergrund aktiv ist.</p>

<p><b>Infos über ChatpartnerInnen</b><br>
Oberhalb der Chatnachrichten siehst du den Namen deiner ChatpartnerIn oder der Gruppe. Klicke oder tippe darauf, um Informationen zu der Person / Gruppe zu erhalten.</p>
<hr>

<h3>Einstellungen</h3>

<p><b>Sprache</b><br>
An erster Stelle kannst du hier deine bevorzugte Sprache wählen. Derzeit stehen Englisch und Deutsch zur Verfügung.</p>

<p><b>Status</b><br>
Gleich darunter kannst du etwas über dich oder was dich gerade beschäftigt schreiben. Diese Information können deine Kontakte sehen. Sie bleibt so lange erhalten bis du sie löschst oder durch eine andere ersetzt.</p>

<p><b>Farbgebung</b><br>
Mit dieser Auswahl beeinflusst du das allgemeine Aussehen der App. Du bestimmst die Akzentfarbe und <i>ticker</i> wählt automatisch weitere, dazu passende Farben.<br>
In dieser Farbe wirst du auch deinen Kontakten angezeigt.</p>

<p><b>Modus</b><br>
Hell oder Dunkel ist oft Geschmacksfrage. Probier aus was dir am besten gefällt. Generell eignet sich der dunkle Modus wenn du in einer dunkleren Umgebung bist oder längere Zeit auf den Bildschirm schaust. In heller Umgebung ist der helle Modus zu empfehlen.</p>

<p><b>Töne</b><br>
Beim Senden und Empfangen von Nachrichten, spielt <i>ticker</i> Kurze Nachrichtentöne ab, die du hier ein- oder ausschalten kannst.</p>

<p><b>Vollbild</b><br>
Wähle den Vollbild-Modus, um Browser-Anzeigen wie die Adressleiste oder die Tab-Übersicht auszublenden.</p>

<p><b>Update-Intervall</b><br>
Hier legst du fest wie häufig Nachrichten automatisch abgerufen werden. Der Wert wird in Minuten angegeben.</p>

<p><b>Nutzerprofil</b><br>
Du kannst deine Nutzerdaten wie Name und E-Mail-Adresse ändern. Möchtest du das Passwort oder die Berechtigungen anpassen, so geht das ebenfalls hier.<br>
Bitte bedenke, dass deine Kontakte dich immer mit dem Nutzernamen (falls angegeben) oder mit deinem Vor- und Zunamen sehen und dich gegebenenfalls darüber auch finden können. Die hier angegebene E-Mail-Adresse musst du auch bei der Anmeldung verwenden.</p>
<p>Berechtigungen</p>
<ul>
<li>Benachrichtigungen erlauben<br>
Lege fest, ob dein Gerät Benachrichtigungen anzeigen darf.</li>
<li>In diesem Browser angemeldet bleiben<br>
Mit dieser Option musst du dich nicht jedes Mal neu anmelden, wenn du <i>ticker</i> aufrufst. Diese Option ist äußerst praktisch, du solltest sie aber nur auf Geräten wählen, die durch PIN-Codes oder Gesichtserkennung etc. geschützt sind. Sobald du dich ausdrücklich abmeldest, wird diese Einstellung zurückgesetzt.</li>
<li>Anderen <i>ticker</i>-NutzerInnen erlauben, dich zu finden<br>
Nur so kannst du auf <i>ticker</i> gefunden werden. Andere Nutzer können zur Suche deinen Vor- und Nachnamen, deinen Nutzernamen und deine E-Mail-Adresse verwenden.</li>
</ul>

<p><b>Abmelden</b><br>
Insbesondere auf Geräten, die von mehreren Menschen genutzt werden, kann es sinnvoll sein, sich nach der Nutzung abzumelden. Dadurch stellt du sicher, dass niemand deine Nachrichten einsehen kann. Um dich wieder anzumelden, benötigst du deine E-Mail-Adresse und dein Passwort.</p>

<div class="camouflage"></div>
`

toggleLanguage(config.language, "self");
