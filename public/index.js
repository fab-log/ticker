const version = "0.0.1";
const pVersion = document.querySelector("#pVersion");
pVersion.innerHTML = version;

let config = {
	language: 1,
	mode: "light",
	hue: 50
}

let currentUser = {
	config
};

const modal = document.querySelector(".modal");
// const imgChatName = document.querySelector("#imgChatName");
const pChatName = document.querySelector("#pChatName");

const audioIn = document.querySelector("#audioIn");
const audioOut = document.querySelector("#audioOut");

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

// ### NEEDS TESTING! ###
const sanitize = (string) => {
	return string.replace(/[&<>"'\/]/g, function (char) {
	  switch (char) {
		case '&':
		  return '&amp;';
		case '<':
		  return '&lt;';
		case '>':
		  return '&gt;';
		case '{':
		  return '&#x7b;';
		case '}':
		  return '&#x7d;';
		case '[':
		  return '&#x5b;';
		case ']':
		  return '&#x5d;';
		case '(':
		  return '&#x28;';
		case ')':
		  return '&#x29;';
		case '"':
		  return '&quot;';
		case "'":
		  return '&#39;';
		case '/':
		  return '&#x2F;';
		default:
		  return char;
	  }
	});
}

const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i;
const phoneRegex = /^(?:\+?\d{1,3})?\d{5,}$/;
const twoDotsRegex = /\..*\..*/;

const format = (string) => {
    string = string.replace(/(?:\r\n|\r|\n)/g, " <br>");
    let wordsArray = string.split(" ");
    let output = "";
    wordsArray.forEach(e => {
        if (emailRegex.test(e) === true) {
            output += `<a href="mailto:${e}">${e}</a> `;
            return;
        }
        if ((twoDotsRegex.test(e) === false && e.includes(".") && isNaN(e) && !e.endsWith(".")) || (e.substring(0, 4) === "http") || (e.substring(0, 4) === "www.")) {
            let link = e;
            if (e.substring(0, 4) != "http") {
                link = "https://" + e;
            }
            output += `<a href="${link}" target="_blank" rel="noopener noreferrer">${e}</a> `;
            return;
        }
        if (phoneRegex.test(e) === true) {
            output += `<a href="tel:${e}">${e}</a> `;
            return;
        }
        output += `${e} `;
    });
    output = output.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\*(.*?)\*/g, '<i>$1</i>')
    return output;
}

let hueTimestamp;

const inpColor = document.querySelector("#inpColor");
const colorValue = document.querySelector("#colorValue");
const changeColor = () => {
	let value = inpColor.value;
	document.body.classList.remove(`hue${config.hue}`)
	// document.body.className = "";
	document.body.classList.add(`hue${value}`);
	/* if (config.mode === "dark") {
		document.body.classList.add("dark-mode");
	} else {
		document.body.classList.add("light-mode");
	} */
	document.querySelector("#colorValue").innerHTML = value;
	config.hue = value;
	hueTimestamp = Date.now();
	setTimeout(() => {
		if ((Date.now() - hueTimestamp) > 9999) {
			currentUser.config.hue = config.hue;
			updateUserSilent();
			console.log("currentUser.config.hue updated to: " + currentUser.config.hue);
		}
	}, 10000);
}

const menu = document.querySelector(".menu");
const strMenuH3Language = document.querySelector("#strMenuH3Language");
const taAboutMe = document.querySelector("#taAboutMe");
const toggleMenu = () => {
	if (menu.classList.contains("hidden")) {
		menu.classList.remove("hidden");
		menu.classList.add("visible");
		strMenuH3Language.scrollIntoView();
		if (currentUser.id && currentUser.about.length > 0) {
			taAboutMe.value = currentUser.about.at(-1);
		}
		pChatName.style.display = "none";
	} else {
		menu.classList.remove("visible");
		menu.classList.add("hidden");
		// imgChatName.style.display = "block";
		pChatName.style.display = "block";
	}
}

const toggleManual = () => {
	if (modal.classList.contains("hidden")) {
		modal.classList.remove("hidden");
		modal.classList.add("visible");
		modal.innerHTML = lang(manualEn, manualDe);
	} else {
		modal.classList.remove("visible");
		modal.classList.add("hidden");
		modal.innerHTML = "";
	}
}

let coloredTextBrightness = 40;

const toggleMode = (mode, triggerSource) => {
	if (mode === "dark") {
		config.mode = "dark";
		document.body.classList.remove("light-mode");
		document.body.classList.add("dark-mode");
		coloredTextBrightness = 50;
	}
	if (mode === "light") {
		config.mode = "light";
		document.body.classList.remove("dark-mode");
		document.body.classList.add("light-mode");
		coloredTextBrightness = 40;
	}
	renderOverview();
	if (currentChat.id) renderChat(currentChat.id);
	currentUser.config.mode = config.mode;
	if (!triggerSource && currentUser.id) {
		updateUserSilent();
	}
}

const strMenuBtnAboutMe = document.querySelector("#strMenuBtnAboutMe");
strMenuBtnAboutMe.addEventListener("click", () => {
	if (currentUser.about.at(-1) === sanitize(taAboutMe.value)) {
		showAlert(lang("no changes made!", "Keine Änderungen!"));
		return;
	}
	currentUser.about.push(sanitize(taAboutMe.value));
	updateUserSilent();
	showAlert(lang("your ticker has been updated", "Dein ticker wurde aktualisiert"));
});

const inpAudio = document.querySelector("#inpAudio");
const setAudio = () => {
	if (inpAudio.value === "0") {
		config.audio = false;
		inpAudio.classList.remove("switch-active");
	} else if (inpAudio.value === "1") {
		config.audio = true;
		inpAudio.classList.add("switch-active");
	}
	currentUser.config.audio = config.audio;
	console.log("currentUser.config.audio: " + currentUser.config.audio)
	updateUserSilent();
}

const fullScreen = document.documentElement;
const openFullscreen = () => {
	if (fullScreen.requestFullscreen) {
		fullScreen.requestFullscreen();
	} else if (fullScreen.webkitRequestFullscreen) {
	fullScreen.webkitRequestFullscreen();
	} else if (fullScreen.msRequestFullscreen) {
	fullScreen.msRequestFullscreen();
	}
};
const strMenuBtnTriggerFullscreen = document.querySelector("#strMenuBtnTriggerFullscreen");
strMenuBtnTriggerFullscreen.addEventListener("click", openFullscreen);

let intervalId;
let autoUpdateTimestamp;
const inpUpdateInterval = document.querySelector("#inpUpdateInterval");
const pUpdateInterval = document.querySelector("#pUpdateInterval");
const setUpdateInterval = () => {
	autoUpdateTimestamp = Date.now();
	pUpdateInterval.innerHTML = inpUpdateInterval.value;
	let value = inpUpdateInterval.value * 60000;
	setTimeout(() => {
		if ((Date.now() - autoUpdateTimestamp) > 9999) {
			config.autoUpdate = value;
			currentUser.config.autoUpdate = value;
			clearInterval(intervalId);
			intervalId = setInterval(checkForNewMessages, value);
			updateUserSilent();
			console.log("currentUser.config.autoUpdate updated to: " + currentUser.config.autoUpdate);
		}
	}, 10000);
}

const closeFullscreen = () => {
	if (document.exitFullscreen && document.fullscreenElement) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	}
};
const strMenuBtnExitFullscreen = document.querySelector("#strMenuBtnExitFullscreen");
strMenuBtnExitFullscreen.addEventListener("click", closeFullscreen);

const divAlert = document.querySelector("#alert");
const showAlert = (text, duration) => {
	console.log(`### => fn showAlert saying: "${text}" triggered`);
	let ms;
	duration ? ms = duration : ms = 3000;
	divAlert.classList.remove("fade-out");
	divAlert.style.display = "block";
	divAlert.style.opacity = "1";
	divAlert.style.visibility = "visible";
	divAlert.innerHTML = `<p>${text}</p>`;
	setTimeout(() => {
		divAlert.classList.add("fade-out");
		setTimeout(() => {
				document.querySelector("#alert").innerHTML = "";
				document.querySelector("#alert").style.display = "none";
		}, 499);
		
	}, ms - 500);
};

const lang = (english, german) => {
	let languages = [english, german];
	return languages[config.language]
}

const dateToString = (jsTimestamp) => {
    if (jsTimestamp === "") {
        return "";
    } else {
        let year = new Date(jsTimestamp).getFullYear();
        let month = new Date(jsTimestamp).getMonth() + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        let day = new Date(jsTimestamp).getDate();
        if (day < 10) {
            day = `0${day}`;
        }
        return `${year}-${month}-${day}`;
    }
};

const dateAndTimeToString = (jsTimestamp) => {
    if (jsTimestamp === "") {
        return "";
    } else {
        let year = new Date(jsTimestamp).getFullYear();
        let month = new Date(jsTimestamp).getMonth() + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        let day = new Date(jsTimestamp).getDate();
        if (day < 10) {
            day = `0${day}`;
        }
        let hour = new Date(jsTimestamp).getHours();
		let euHour = hour;
		let usHour = hour;
        if (euHour < 10) {
            euHour = `0${euHour}`;
        }
		let ampm = "am";
		if (usHour >= 12) {ampm = "pm"}
		if (usHour > 12) {usHour -= 12}
		/* if (usHour < 10) {usHour = `0${usHour}`} */
        let minute = new Date(jsTimestamp).getMinutes();
        if (minute < 10) {
            minute = `0${minute}`;
        }
		if (config.language === 0) {
			return `${year}/${month}/${day} · ${usHour}:${minute} ${ampm}`;
		}
        if (config.language === 1) {
			return `${day}.${month}.${year} · ${euHour}:${minute}`
		}
    }
}

const logoHeader = document.querySelector("#logo-header");
const showHome = () => {
	console.log("### => fn showHome triggered");
	document.querySelectorAll(".home-item").forEach(e => {
		e.style.display = "block";
	});
	logoHeader.style.display = "none";
}

const toggleModal = () => {
	if (modal.classList.contains("hidden")) {
		modal.classList.remove("hidden");
		modal.classList.add("visible");
		// imgChatName.style.display = "none";
		pChatName.style.display = "none";
	} else {
		modal.classList.remove("visible");
		modal.classList.add("hidden");
		// imgChatName.style.display = "block";
		pChatName.style.display = "block";
		modal.innerHTML = "";
	}	
}

const showModal = () => {
	modal.classList.remove("hidden");
	modal.classList.add("visible");
	// imgChatName.style.display = "none";
	pChatName.style.display = "none";
}

const closeModal = () => {
	modal.classList.remove("visible");
	modal.classList.add("hidden");
	// imgChatName.style.display = "block";
	pChatName.style.display = "block";
}

const closeAllModals = () => {
	modal.classList.remove("visible");
	modal.classList.add("hidden");
	menu.classList.remove("visible");
	menu.classList.add("hidden");
	// imgChatName.style.display = "block";
	pChatName.style.display = "block";
}

const dismiss = () => {
	modal.classList.remove("visible");
	modal.classList.add("hidden");
	// imgChatName.style.display = "block";
	// pChatName.style.display = "block";
	showHeaderIcons();
	modal.innerHTML = "";
}

const imgOverviewHeaderPlus = document.querySelector("#imgOverviewHeaderPlus");
const imgOverviewHeaderUpdate = document.querySelector("#imgOverviewHeaderUpdate");
const imgChatHeaderUpdate = document.querySelector("#imgChatHeaderUpdate");
const btnBackToOverview = document.querySelector("#btnBackToOverview");

const hideHeaderIcons = () => {
	// imgChatName.style.display = "none";
	btnBackToOverview.style.display = "none";
	imgOverviewHeaderPlus.style.display = "none";
	imgOverviewHeaderUpdate.style.display = "none";
	imgChatHeaderUpdate.style.display = "none";
}

const showHeaderIcons = () => {
	// imgChatName.style.display = "block";
	imgOverviewHeaderPlus.style.display = "block";
	imgOverviewHeaderUpdate.style.display = "block";
	if (window.innerWidth <= 1024) {
		imgChatHeaderUpdate.style.display = "block";
		btnBackToOverview.style.display = "block";
	}
}


/* document.querySelector("#uploadForm").addEventListener("submit", (event) => {
	event.preventDefault();
	const fileInput = document.querySelector("#fileInput");
	const file = fileInput.files[0];

	if (file.size > 10 * 1024 * 1024) {
		showAlert(lang("file must not exceed 10 mb", "Datei darf nicht größer als 10 MB sein"));
		return;
	}

	const formData = new FormData();
	formData.append("image", file);
	formData.append("userId", currentUser.id);

	fetch("/ticker.upload", {
		method: "POST",
		body: formData
	})
	.then(response => response.json())
	.then(data => {
		console.log("upload successful: " + data.message);
	})
	.catch(error => {
		console.error("Error:", error);
	})
}); */