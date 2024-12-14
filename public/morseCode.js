const morseCode = [
    ["a", ".-"], 
    ["b", "-..."], 
    ["c", "-.-."], 
    ["d", "-.."], 
    ["e", "."], 
    ["f", "..-."], 
    ["g", "--."], 
    ["h", "...."], 
    ["i", ".."], 
    ["j", ".---"], 
    ["k", "-.-"], 
    ["l", ".-.."], 
    ["m", "--"], 
    ["n", "-."], 
    ["o", "---"], 
    ["p", ".--."], 
    ["q", "--.-"], 
    ["r", ".-."], 
    ["s", "..."], 
    ["t", "-"], 
    ["u", "..-"], 
    ["v", "...-"], 
    ["w", ".--"], 
    ["x", "-..-"], 
    ["y", "-.--"], 
    ["z", "--.."], 
    ["0", "-----"], 
    ["1", ".----"], 
    ["2", "..---"], 
    ["3", "...--"], 
    ["4", "....-"], 
    ["5", "....."], 
    ["6", "-...."], 
    ["7", "--..."], 
    ["8", "---.."], 
    ["9", "----."], 
    [".", ".-.-."], 
    [",", "--..--"], 
    ["?", "..--.."], 
    ["!", "-.-.--"], 
    [";", "-.-.-."], 
    ["ä", ".-."], 
    ["ö", "---."], 
    ["ü", "..--"],
    [" ", " "]
];

const translateToMorse = (string) => {
    let characterArray = [...string];
    // console.log({ characterArray });
    let html = "";
    characterArray.forEach(e => {
        if (e === " ") {
            html += `<div class="morseLongSpace"></div><br>`;
            return;
        }
        let index = morseCode.findIndex(el => el[0] === e.toLowerCase());
        if (index === -1) {
            return;
        } else if (index >= 0) {
            let morseCharacter = morseCode[index][1];
            let morseCharacterArray = [...morseCharacter];
            morseCharacterArray.forEach(element => {
                element === "." ? html += `<div class="morseShort"></div>` :
                element === "-" ? html += `<div class="morseLong"></div>` :
                html += "";
            });
            html += `<div class="morseShortSpace"></div>`;
        };
    });
    // console.log(html);
    return html;
}

const createPersonalLabel = (firstName, lastName) => {
    let html = translateToMorse(firstName.substring(0, 1)) + translateToMorse(lastName.substring(0, 1));
    return html;
}

const homeMorseAdBanner = document.querySelector("#homeMorseAdBanner");
homeMorseAdBanner.innerHTML = translateToMorse("ticker is awsome!").replaceAll("<br>", "");
