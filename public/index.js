const version = "0.4.0 (beta)";
const pVersion = document.querySelector("#pVersion");
pVersion.innerHTML = version;

let config = {
	language: 1,
	mode: "light",
	hue: 30
}

let currentUser = {
	config
};

/* window.addEventListener('resize', () => {
	setTimeout(() => {
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		showAlert(`window.innerHeight: ${window.innerHeight}`);		
	}, 1000);
}); */

const main = document.querySelector(".main");
const modal = document.querySelector(".modal");
const arrowUp = document.querySelector("#arrow-up");
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
/* const sanitize = (string) => {
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
} */

const sanitize = (string) => {
    return string.replace(/[&<>"'\/{}[\]()]/g, (char) => {
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

const urlRegex = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
const phoneRegex = /^(?:\+?\d{1,3})?\d{5,}$/;
const twoDotsRegex = /\..*\..*/;

const format = (string) => {
    string = string.replace(/(?:\r\n|\r|\n)/g, " <br> ");
	let wordsArray = string.split (" ");
    let output = "";

	// 	CHECK FOR LINKS
    wordsArray.forEach(e => {
        if (emailRegex.test(e) === true) {
            output += `<a href="mailto:${e}">${e}</a> `;
            return;
        }
        if (e.toLowerCase().startsWith("https:")) {
            output += `<a href="${e}" target="_blank" rel="noopener noreferrer">${e.length > 60 ? e.substring(18, 60) + '...': e.substring(18)}</a> `;
            return;
        }
        if (e.toLowerCase().startsWith("http:")) {
            output += `<a href="${e}" target="_blank" rel="noopener noreferrer">${e.length > 59 ? e.substring(17, 59) + '...': e.substring(17)}</a> `;
            return;
        }
        if (e.toLowerCase().startsWith("www.")) {
            output += `<a href="${e}" target="_blank" rel="noopener noreferrer">${e.length > 46 ? e.substring(4, 46) + '...': e.substring(4)}</a> `;
            return;
        }
        if (phoneRegex.test(e) === true) {
            output += `<a href="tel:${e}">${e}</a> `;
            return;
        }
        output += `${e} `;
    });
	output = output.replaceAll(" <br> ", " <br>");		// remove unnecssary whitespace

	// NEW VARIANT FOR HEADING, BOLD, AND ITALIC
	// output = output.replace(/^# (.+)$/gm, '<h3>$1</h3>').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
	
	// FORMAT UNORDERED LIST
	const lines = output.split("<br>");		// output.split(/<br>|<\/h3>/);
	output = "";
	let inList = false;
	let ulStart = "<ul>";
	let ulEnd = "";
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].startsWith("- ")) {
			inList = true;
			lines[i] = `${ulStart}<li>${lines[i].substring(2)}</li>`;
			ulStart = "";
		} else {
			if (inList === true) {
				inList = false;
				ulEnd = "</ul>";
				ulStart = "<ul>";
			}
			lines[i] = ulEnd + lines[i] + "<br>";
		}
		output += lines[i];
	}

	// FORMAT HEADING, BOLD, AND ITALIC
    output = output
		.replace(/# (.+?)<br>/g, '<h3>$1</h3>')
		// .replace(/^# (.*$)/gim, '<h3>$1</h3>')
		.replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
		.replace(/\*(.*)\*/gim, '<i>$1</i>') + '\n';

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

arrowUp.addEventListener("click", () => {
	menu.scroll({
		top: 0,
		left: 0,
		behavior: "smooth",
	  });
	  modal.scroll({
		top: 0,
		left: 0,
		behavior: "smooth",
	  });
})

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
		setTimeout(() => {
			arrowUp.style.display = "block";
		}, 500);
		pChatName.style.display = "none";
	} else {
		menu.classList.remove("visible");
		menu.classList.add("hidden");
		// imgChatName.style.display = "block";
		arrowUp.style.display = "none";
		pChatName.style.display = "block";
	}
}

const toggleManual = () => {
	if (modal.classList.contains("hidden")) {
		modal.classList.remove("hidden");
		modal.classList.add("visible");
		modal.innerHTML = lang(manualEn + termsEn, manualDe + termsDe);
		pChatName.style.display = "none";
		setTimeout(() => {
			arrowUp.style.display = "block";
		}, 500);
	} else {
		modal.classList.remove("visible");
		modal.classList.add("hidden");
		modal.innerHTML = "";
		pChatName.style.display = "block";
		arrowUp.style.display = "none";
	}
}

let coloredTextBrightness = 33;

const strMenuBtnToggleDarkMode = document.querySelector("#strMenuBtnToggleDarkMode");
const strMenuBtnToggleLightMode = document.querySelector("#strMenuBtnToggleLightMode");

const toggleMode = (mode, triggerSource) => {
	if (mode === "dark") {
		config.mode = "dark";
		document.body.classList.remove("light-mode");
		document.body.classList.add("dark-mode");
		coloredTextBrightness = 50;
		strMenuBtnToggleDarkMode.setAttribute('disabled', '');
		strMenuBtnToggleLightMode.removeAttribute('disabled');
	}
	if (mode === "light") {
		config.mode = "light";
		document.body.classList.remove("dark-mode");
		document.body.classList.add("light-mode");
		coloredTextBrightness = 33;
		strMenuBtnToggleDarkMode.removeAttribute('disabled');
		strMenuBtnToggleLightMode.setAttribute('disabled', '');
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

const strMenuBtnExitFullscreen = document.querySelector("#strMenuBtnExitFullscreen");
const strMenuBtnTriggerFullscreen = document.querySelector("#strMenuBtnTriggerFullscreen");

const fullScreen = document.documentElement;
const openFullscreen = () => {
	if (fullScreen.requestFullscreen) {
		fullScreen.requestFullscreen();
	} else if (fullScreen.webkitRequestFullscreen) {
	fullScreen.webkitRequestFullscreen();
	} else if (fullScreen.msRequestFullscreen) {
	fullScreen.msRequestFullscreen();
	}
	strMenuBtnTriggerFullscreen.setAttribute('disabled', '');
	strMenuBtnExitFullscreen.removeAttribute('disabled');
};
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
	strMenuBtnTriggerFullscreen.removeAttribute('disabled');
	strMenuBtnExitFullscreen.setAttribute('disabled', '');
};
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
		setTimeout(() => {
			arrowUp.style.display = "block";
		}, 500);
		pChatName.style.display = "none";
	} else {
		modal.classList.remove("visible");
		modal.classList.add("hidden");
		// imgChatName.style.display = "block";
		arrowUp.style.display = "none";
		pChatName.style.display = "block";
		modal.innerHTML = "";
	}	
}

const showModal = () => {
	modal.classList.remove("hidden");
	modal.classList.add("visible");
	// imgChatName.style.display = "none";
	setTimeout(() => {
		arrowUp.style.display = "block";
	}, 500);
	pChatName.style.display = "none";
}

const closeModal = () => {
	modal.classList.remove("visible");
	modal.classList.add("hidden");
	// imgChatName.style.display = "block";
	arrowUp.style.display = "none";
	pChatName.style.display = "block";
}

const closeAllModals = () => {
	modal.classList.remove("visible");
	modal.classList.add("hidden");
	menu.classList.remove("visible");
	menu.classList.add("hidden");
	// imgChatName.style.display = "block";
	arrowUp.style.display = "none";
	pChatName.style.display = "block";
}

const dismiss = () => {
	modal.classList.remove("visible");
	modal.classList.add("hidden");
	arrowUp.style.display = "none";
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
