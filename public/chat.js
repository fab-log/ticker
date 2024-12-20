const divChat = document.querySelector(".chat");
const divOverview = document.querySelector(".overview");
const chatItems = document.querySelector(".chat-items");
let currentChat = {};
let renderChatCounter = 0;

const getChat = async (chatId) => {
	console.log(`### => fn getChat ${chatId} triggered`);
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ chatId }),
	};
	const response = await fetch("/ticker.getChat", options);
	let serverResponse = await response.json();
	let status = serverResponse.status;
	console.log({ status });
	if (!serverResponse.data || serverResponse.data === undefined || serverResponse.data === null) {
		showAlert(status);
		return;
	}
	return serverResponse.data;
}

let chats = [];

const getChats = async () => {
	console.log("### => fn getChats triggered");
	console.time("getChats");
	// startLoader();
	imgOverviewHeaderUpdate.classList.add("rotate");
	imgChatHeaderUpdate.classList.add("rotate");
	setTimeout(() => {
		imgOverviewHeaderUpdate.classList.remove("rotate");
		imgChatHeaderUpdate.classList.remove("rotate");
	}, 1500);
	chats = [];
	for (let i = 0; i < currentUser.chats.length; i++) {
		chats.push(await getChat(currentUser.chats[i]));
	}
	console.log({ chats });
	// stopLoader();
	// renderOverview();
	console.timeEnd("getChats");
}

const updateChat = async () => {
	console.log("### => fn updateChat " + currentChat.id + " triggered");
	startLoader();
	let data = {
		userId: currentUser.id,
		chat: currentChat
	};

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data),
	};
	const response = await fetch("/ticker.updateChat", options);
	let serverResponse = await response.json();
	let status = serverResponse.status;
	stopLoader();
	if (status != "OK") {
		showAlert(status);
		return;
	}
	console.log({ status });
	let index = chats.findIndex(e => e.id === currentChat.id);
	if (index === -1) {
		showAlert(lang("internal app error<br>please reload the app try again", "Interner Applikationsfehler<br>Bitte aktualisiere die App und versuche es noch einmal"));
		console.log("internal app error");
		return;
	}
	chats.splice(index, 1, serverResponse.data);
	currentChat = serverResponse.data;
}

const highlightActiveOverviewItem = () => {
	if (currentChat.id) {
		console.log("currentChat.id: " + currentChat.id);
		let overviewItemId = `#overview-item_${currentChat.id}`;
		let overviewItems = document.querySelectorAll(".overview-item");
		overviewItems.forEach(e => e.classList.remove("active-item"));
		document.querySelector(overviewItemId).classList.add("active-item");
	}
}

const divOverviewItems = document.querySelector("#divOverviewItems");

const renderOverview = () => {
	console.log("### => fn renderOverview triggered");
	if (chats.length === 0) {
		imgOverviewHeaderPlus.style.display = "block";
		imgOverviewHeaderUpdate.style.display = "block";
		document.querySelector(".welcome-item").style.display = "block";
		document.querySelector("#home-item-right").style.display = "block";
		return;
	}
	divOverviewItems.innerHTML = "";
	// chats.sort((a, b) => a.messages.at(-1).text.at(-1)[0] - b.messages.at(-1).text.at(-1)[0]);
	chats.sort((a, b) => {
		const aHasMessages = Array.isArray(a.messages) && a.messages.length > 0;
		const bHasMessages = Array.isArray(b.messages) && b.messages.length > 0;
		if (aHasMessages && bHasMessages) {
			return a.messages.at(-1).text.at(-1)[0] - b.messages.at(-1).text.at(-1)[0];
		}
		if (aHasMessages) return 1;
		if (bHasMessages) return -1;
		return 0;
	});
	chats.forEach(e => {
		let newMessagesCounter = 0;
		let morseLetter1 = "";
		let morseLetter2 = "";
		let hue, index;
		if (e.participants.length === 2) {
			index = connectedUsers.findIndex(el => el.id === e.participants[1][1]);
			if (index === -1) {
				index = connectedUsers.findIndex(element => element.id === e.participants[0][1]);
				if (index === -1) {
					console.log("no match found for chat " + e.id);
					return;
				}
			}
			morseLetter1 = translateToMorse(connectedUsers[index].firstName.substring(0, 1));
			morseLetter2 = translateToMorse(connectedUsers[index].lastName.substring(0, 1));
			hue = connectedUsers[index].hue;
		}
		
		// ### NAME ###
		let name = "";
		if (e.groupName != "") {
			name = "⛬ " + e.groupName;
			morseLetter1 = translateToMorse("e");
			morseLetter2 = translateToMorse("i");
			hue = 0;
		} else {
			if (connectedUsers[index].userName === "") {
				name = `${connectedUsers[index].firstName} ${connectedUsers[index].lastName}`
			} else {
				name = connectedUsers[index].userName;
			}
		}

		let randomRotation = (Math.random() - 0.5) * 15;

		// ### ADD NEW MESSAGE BADGE ###
		let index2 = e.participants.findIndex(el => el[1] === currentUser.id);
		let lastSeen = e.participants[index2][0];
		e.messages.forEach(element => {
			if (element.text.at(-1)[0] > lastSeen) {
				newMessagesCounter += 1;
			}
		});
		let badgeHtml = "";
		if (newMessagesCounter > 0) {
			badgeHtml = `<div class="counter-badge" id="badge_${e.id}"><p>${newMessagesCounter}</p></div>`;
		}
		
		// ### RENDER ITEMS ###
		let lastMessageTimestamp, lastMessageText;
		if (e.messages.length === 0) {
			lastMessageTimestamp ="";
			lastMessageText = lang('<i>[ ... ticker some news ... ]</i>', '<i>[ ... ticker was gerade los ist ... ]</i>');
		} else {
			lastMessageTimestamp = dateAndTimeToString(e.messages.at(-1).text.at(-1)[0]);
			lastMessageText = e.messages.at(-1).text.at(-1)[1];
			let length = lastMessageText.length;
			if (lastMessageText.substring(length - 7, length).toLowerCase() === "[morse]") {
				lastMessageText = lastMessageText.substring(0, length - 7);	
			}
		}

		divOverviewItems.insertAdjacentHTML("afterbegin", `
			<div class="overview-item" id="overview-item_${e.id}" onclick="getAndRenderChat('${e.id}')">
				<div>
					${badgeHtml}
					<div class="personal-label" style="rotate: ${randomRotation}deg; border: 3px solid hsl(${hue}, 25%, 50%);">
						<div class="morse-container first-row">${morseLetter1}</div>
						<div class="morse-container">${morseLetter2}</div>
					</div>
				</div>
					<div>
						<p><span class="overview-name" style="color: hsl(${hue}, 25%, 50%);">${name}</span><span class="timestamp">${lastMessageTimestamp}</span><br>${lastMessageText}</p>
					</div>
			</div>
		`);
		if (document.querySelector(`#badge_${e.id}`)) {
			document.querySelector(`#badge_${e.id}`).classList.add("scale-in-out");
			setTimeout(() => {
				document.querySelector(`#badge_${e.id}`).classList.remove("scale-in-out");
			}, 3000);
		}
	});
}

const getAndRenderChat = async (id) => {
	await getChat(id);
	renderChat(id);
}

const modalContextMenuMessage = document.querySelector(".modal-context-menu-message");

const editMessage = (id) => {
	console.log("editMessage " + id + "triggered");
	const ta = document.querySelector("#ta");
	let index = currentChat.messages.findIndex(e => e.id === id);
	let text = currentChat.messages[index].text.at(-1)[1];
	if (ta.value === text) {
		showAlert(lang("no changes made", "Keine Änderungen"));
		return;
	}
	currentChat.messages[index].text.push([Date.now(), ta.value]);
	updateChat();
	// toggleModal();
	closeModal();
	renderOverview();
	renderChat(currentChat.id);
}

const renderModalEditMessage = (id) => {
	let index = currentChat.messages.findIndex(e => e.id === id);
	let text = currentChat.messages[index].text.at(-1)[1];
	modal.innerHTML = `
		<textarea id="ta" rows="4" style="width: calc(100% - 48px);">${text}</textarea>
		<hr>
		<button type="button" onclick="closeModal()">${lang("dismiss", "abbrechen")}</button>
		<button type="button" onclick="editMessage('${id}')">${lang("update", "ändern")}</button>
	`;
	toggleModal();
	modalContextMenuMessage.style.display = "none";
}

const deleteMessage = (id) => {
	console.log("deleteMessage " + id + "triggered");
	modalContextMenuMessage.style.display = "none";
}

const closeModalContext = () => {
	modalContextMenuMessage.style.display = "none";
}



const confirmDeleteMessage = async (id) => {
	console.log("confirmDeleteMessage " + id + "triggered");
	modalContextMenuMessage.innerHTML = `
	<p>${lang("Sure you want to delete the message?", "Sicher dass du die Nachricht löschen möchtest?")}</p>
	<hr>
	<button type="button" onclick="closeModalContext()">${lang("no", "nein")}</button>
	<button type="button" onclick="deleteMessage('${id}')">${lang("yes, delete", "ja, löschen")}</button>
	`;
	let index = currentChat.messages.findIndex(e => e.id === id);
	if (index === -1) {
		showAlert(lang("internal error", "App-Fehler"));
		return;
	}
	currentChat.messages.splice(index, 1);
	await updateChat();
	renderChat(currentChat.id);
	modalContextMenuMessage.style.display = "none";
}

const contextMessage = (event, id) => {
	event.preventDefault();
	console.log("contextmenu triggered. Message " + id);
	let index = currentChat.messages.findIndex(e => e.id === id);
	if (currentChat.messages[index].author != currentUser.id) {
		showAlert(lang("You can only edit your own messages", "Du kannst nur deine eigenen Nachrichten bearbeiten"), 5000);
		closeModalContext();
		return;
	}
	let editMessageString = lang("edit message", "Nachricht bearbeiten");
	let deleteMessageString = lang("delete message", "Nachricht löschen");
	modalContextMenuMessage.innerHTML = `<p onclick="renderModalEditMessage('${id}')">${editMessageString}</p><hr><p onclick="confirmDeleteMessage('${id}')">${deleteMessageString}</p>`;
	modalContextMenuMessage.style.display = "block";
	window.onclick = function(event) {
		if (event.target != modalContextMenuMessage) {
			closeModalContext();
		}
	};
}

const editGroup = async () => {
	const inpGroupName = document.querySelector("#inpGroupName");
	const inpNewGroupMember = document.querySelectorAll(".inpNewGroupMember");
	let participants = [[Date.now(), currentUser.id]];
	inpNewGroupMember.forEach(e => {
		if (e.checked) {participants.push([Date.now(), e.id])}
	});
	if (participants.length < 3) {
		showAlert(lang("Please choose at least two chat partners", "Bitte wähle mindestens zwei Chat-PartnerInnen"));
		return;
	}
	if (inpGroupName.value === "") {
		showAlert(lang("Please enter a group name", "Bitte gib einen Gruppennamen an"));
		inpGroupName.focus();
		return;
	}
	if (inpGroupName.value.length > 25) {
		showAlert(lang("Please choose a shorter group name", "Bitte wähle einen kürzeren Gruppennamen"));
		inpGroupName.focus();
		return;
	}
	currentChat.participants = participants;
	currentChat.groupName = inpGroupName.value;

	updateChat();
	closeAllModals();
	showHeaderIcons();
	renderOverview();
	renderChat(currentChat.id);	
}

const renderModalEditGroup = () => {
	let connectedUsersList = "";
	connectedUsers.forEach(e => {
		let userName = "";
		if (e.userName != "") {
			userName = `(${e.userName})`;
		}
		let checkedState =  "";
		if (currentChat.participants.some(el => el[1] === e.id)) {
			checkedState = "checked";
		}
		connectedUsersList += `
			<div class="searchResultItem">
				<label for="${e.id}">
					<p>
					<input type="checkbox" class="inpNewGroupMember" id="${e.id}" ${checkedState}>
					${e.firstName} ${e.lastName} ${userName}
					</p>
				</label>
			</div>
			`;
	});
	modal.innerHTML = `
		<h3>${lang("Edit Group", "Gruppe bearbeiten")}</h3>
		<input type="text" id="inpGroupName" placeholder="${lang("group name", "Gruppenname")}">
		<hr>
		<p>${lang("Select the users you want to add to or remove from the group", "Wähle die NutzerInnen aus, die du hinzufügen oder entfernen möchtest")}</p>
		${connectedUsersList}<br>
		<p class="small">${lang("If you remove a chat partner he or she will no longer receive messages of this group. Past messages will still be visible, though.", "Wenn du hier einen Kontakt enfernst, wird diejenige Person keine neuen Nachrichten aus dem Chat mehr erhalten. Bisherige Nachrichten bleiben aber sichtbar.")}</p>
		<hr>
		<button type="button" onclick="closeModal(); showHeaderIcons()">${lang("dismiss", "abbrechen")}</button>
		<button type="submit" onclick="editGroup()">${lang("submit changes", "Änderungen speichern")}</button>
		<div class="camouflage"></div>
	`;
	document.querySelector("#inpGroupName").value = currentChat.groupName;
	showModal();
	hideHeaderIcons();
}

const renderChat = async (chatId) => {
	console.log(`### => fn renderChat ${chatId} triggered`);

	if (window.innerWidth <= 1024) {						// && renderChatCounter > 0
		divOverview.classList.remove("slide-in-from-left");
		divOverview.style.display = "none";
		divChat.style.display = "block";
		btnBackToOverview.style.display = "block";
		imgChatHeaderUpdate.style.display = "block"
	}
	renderChatCounter += 1;

	chatItems.innerHTML = "";
	let index = chats.findIndex(e => e.id === chatId);
	currentChat = chats[index];

	if (document.querySelector(`#badge_${chatId}`)) {
		setTimeout(() => {
			document.querySelector(`#badge_${chatId}`).classList.add("diffuse");
			setTimeout(() => {
				document.querySelector(`#badge_${chatId}`).style.display = "none";				
			}, 950);
			if (currentChat.id) {
				let index3 = currentChat.participants.findIndex(e => e[1] === currentUser.id);
				currentChat.participants[index3][0] = Date.now();
				updateChat();
			}
		}, 5000);
	}

	let lastMessageId = "";
	let chatName = "";

	for (let i = 0; i < currentChat.messages.length; i++) {
		let inOut, author;
		let hue = config.hue;
		let morse = "";
		let text = currentChat.messages[i].text.at(-1)[1];
		let length = text.length;
		if (text.substring(length - 7, length).toLowerCase() === "[morse]") {
			morse = "<hr>" + translateToMorse(text.substring(0, length - 7));
			text = text.substring(0, length - 7);

		}
		if (currentChat.messages[i].author != currentUser.id) {
			inOut = "in";
			let index = connectedUsers.findIndex(el => el.id === currentChat.messages[i].author); // && connectedUsers[index].firstName;
			hue = connectedUsers[index].hue;
			if (connectedUsers[index].userName === "" || connectedUsers[index].userName === undefined || connectedUsers[index].userName === null) {
				author = connectedUsers[index].firstName;
			} else {
				author = connectedUsers[index].userName;
			}
		} else {
			inOut = "out";
			author = lang("me", "Ich")
		}

		chatItems.insertAdjacentHTML("beforeend", `
			<div class="chat-item ${inOut}" id="${currentChat.messages[i].id}">
				<p><span class="overview-name" style="color: hsl(${hue}, 25%, 50%)">${author}</span><span class="timestamp">${dateAndTimeToString(currentChat.messages[i].text.at(-1)[0])}</span><br>
				${format(text)}</p>${morse}
			</div>
		`);
		lastMessageId = currentChat.messages[i].id;
		if (i >= currentChat.messages.length - 10) {
			document.querySelector(`#${lastMessageId}`).classList.add("slide-in-from-top");
		}
		document.querySelector(`#${currentChat.messages[i].id}`).addEventListener("contextmenu", () => {
			contextMessage(event, currentChat.messages[i].id);
		})
	}

	currentChat.messages.length > 3 && document.querySelector(`#${lastMessageId}`).scrollIntoView();

	chatItems.insertAdjacentHTML("beforeend", `
		<div class="message-input">
			<textarea class="ta-message-input" id="taMessageInput" rows="3" maxlength="10000" placeholder="${lang(" ... ticker your message here ...", " ... ticker deine Nachricht hier ...")}"></textarea>
			<img src="pix/play.webp" alt="send message" title="${lang("send message", "Nachricht absenden")}" id="imgSendMessage" style="filter: sepia(100%) hue-rotate(${config.hue}deg) saturate(1.5); animation: pulse 1.25s ease-in-out infinite" onclick="sendMessage()">
		</div>
	`);

	const taMessageInput = document.querySelector("#taMessageInput");
	taMessageInput.scrollIntoView();
	if (window.innerWidth > 1024) taMessageInput.focus();
	
	// ### CHAT NAME ###
	let pChatNameColor;
	if (currentChat.groupName != "") {
		chatName = "⛬ " + currentChat.groupName;
		pChatNameColor = "hsl(0, 25%, 50%)";
	} else {
		let index = connectedUsers.findIndex(e => e.id === currentChat.participants[1][1]);
		if (index === -1) {
			index = connectedUsers.findIndex(e => e.id === currentChat.participants[0][1]);
		}
		if (connectedUsers[index].userName === "" || connectedUsers[index].userName === undefined || connectedUsers[index].userName === null) {
			chatName = connectedUsers[index].firstName;
		} else {
			chatName = connectedUsers[index].userName;
		}
		pChatNameColor = `hsl(${connectedUsers[index].hue}, 25%, 50%)`
	}
	pChatName.style.color = pChatNameColor;
	pChatName.innerHTML = chatName;
	pChatName.addEventListener("click", () => {
		hideHeaderIcons();
		showModal();
		let about = "";
		let name = `⛬ ${currentChat.groupName} <span class="small">${lang(" (group)", " (Gruppe)")}</span>`
		// let name = currentChat.groupName + lang(" (⛬ group)", " (⛬ Gruppe)");
		let members = "";
		let morseLetter1;
		let morseLetter2;
		let hue;
		let editButton = "";
		if (currentChat.groupName === "") {
			index = connectedUsers.findIndex(e => e.id === currentChat.participants[1][1]);
			if (index === -1) index = connectedUsers.findIndex(e => e.id === currentChat.participants[0][1]);
			about = connectedUsers[index].about.at(-1) || lang("<i>[no info so far]</i>", "<i>[noch nichts geschrieben]</i>");
			let userName = "";
			if (connectedUsers[index].userName != "") userName = `(${connectedUsers[index].userName})`;
			name = `${connectedUsers[index].firstName} ${connectedUsers[index].lastName} ${userName}`;
			morseLetter1 = translateToMorse(connectedUsers[index].firstName.substring(0, 1));
			morseLetter2 = translateToMorse(connectedUsers[index].lastName.substring(0, 1));
			hue = connectedUsers[index].hue;
		} else {
			members = `<h4>${lang("Members", "Mitglieder")}</h4>`;
			morseLetter1 = translateToMorse("e");
			morseLetter2 = translateToMorse("i");
			hue = 0;
			let loop = 1;
			currentChat.participants.forEach(e => {
				let index2 = connectedUsers.findIndex(el => el.id === e[1]);
				if (index2 === -1 && e[1] != currentUser.id) return;
				let groupMember;
				let userName = "";
				let founder ="";
				if (loop === 1) {
					founder = lang(", [founder]", ", [GründerIn]")
				}
				if (index2 === -1 && e[1] === currentUser.id) {
					groupMember = lang("Me", "Ich")
				} else {
					if (connectedUsers[index2].userName != "") {
						userName = `(${connectedUsers[index2].userName})`;
					}
					groupMember = `${connectedUsers[index2].firstName} ${connectedUsers[index2].lastName} ${userName}<span class="small">${founder}</span>`;
				}
				members += `- ${groupMember}<br>`;
				loop += 1;
			});
			if (currentChat.participants[0][1] === currentUser.id) {
				editButton = `
					<hr>
					<button type="button" onclick="renderModalEditGroup()">${lang("edit group", "Gruppe bearbeiten")}</button>
				`
			}
		}
		modal.innerHTML = `
			<img src="pix/x.webp" alt="close" title="close" class="close-modal icon" onclick="closeModal(); showHeaderIcons()">
			<br>
			<div class="personal-label" style="border: 3px solid hsl(${hue}, 25%, 50%);">
				<div class="morse-container first-row">${morseLetter1}</div>
				<div class="morse-container">${morseLetter2}</div>
			</div>
			<h3 style="color: hsl(${hue}, 25%, 50%);">${name}</h3>
			<p>${about}</p>
			<p>${members}</p>
			${editButton}
		`
	})
	// imgChatName.style.display = "block";
	highlightActiveOverviewItem();
}

const showOverview = () => {
	currentChat = {};
	divChat.style.display = "none";
	divOverview.style.display = "block";
	divOverview.classList.add("slide-in-from-left");
	let overviewItems = document.querySelectorAll(".overview-item");
	overviewItems.forEach(e => e.classList.remove("active-item"));
	divOverviewItems.scrollTop = 0;
}

const sendMessage = async () => {
	console.log("### => fn sendMessage triggered");
	const taMessageInput = document.querySelector("#taMessageInput");
	if (taMessageInput.value === "") {
		showAlert(lang("nothing to send", "Nichts zu verschicken"));
		return;
	}
	currentChat = await getChat(currentChat.id);
	let messageText = sanitize(taMessageInput.value.trim().substring(0, 10000));
	let newMessage = {
		id: `msg_${Date.now()}_${randomCyphers(12)}`,
		author: currentUser.id,
		text: [
			[Date.now(), messageText]
		]
	}
	currentChat.messages.push(newMessage);
	// const imgSendMessage = document.querySelector("#imgSendMessage");
	await updateChat();
	if (currentUser.config.audio === true) { audioOut.play(); }
	renderOverview(); // ### NEEDS TESTING! ###
	renderChat(currentChat.id);
	taMessageInput.value = "";
	window.innerWidth > 1024 && taMessageInput.focus();
}

/* const updateUser = async (userObject) => {
	console.log("### => fn updateUser triggered");
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ userObject }),
	};
	const response = await fetch("/ticker.updateUser", options);
	let serverResponse = await response.json();
	let status = serverResponse.status;
	console.log({ status });
	if (!serverResponse.data || serverResponse.data === undefined || serverResponse.data === null) {
		stopLoader();
		showAlert(status);
		return;
	}
	stopLoader();
	currentUser = serverResponse.data;
	console.log(JSON.stringify(serverResponse.data, null, 2));
} */

// let newChat;

const addNewChat = async (userId) => {
	console.log("### => fn addNewChat triggered");
	if (connectedUsers.some(e => e.id === userId)) {
		showAlert(lang("user already is one of your chat partners", "Diese NutzerIn ist bereits in deiner Chat-Liste"));
		return;
	}
	if (currentUser.id === userId) {
		showAlert(lang("you cannot chat with yourself", "Du kannst nicht mit dir selbst chatten"));
		return;
	}
	startLoader();
	let newChat = {
		id: `chat_${Date.now()}_${randomCyphers(12)}`,
		participants: [
			[Date.now(), currentUser.id],
			[Date.now(), userId]
		],
		groupName: "",
		messages: [
		]
	}
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ newChat }),
	};
	const response = await fetch("/ticker.addNewChat", options);
	let serverResponse = await response.json();
	let status = serverResponse.status;
	console.log({ status });
	stopLoader();
	if (serverResponse.status != "OK") {
		showAlert(status);
		return;
	}
	currentUser = serverResponse.data;
	console.log(currentUser);
	// currentUser.chatPartners.push(userId);
	// currentUser.chats.push(newChat.id);
	await getConnectedUsers();
	// updateUser(currentUser);
	closeAllModals();
	chats.push(newChat);
	renderOverview();
	renderChat(newChat.id);
	let result = serverResponse.data;
}

const showNotification = (text) => {
	const notification = new Notification('ticker', {
		body: text,
		icon: 'favicon.png'
	});

	setTimeout(() => {
		notification.close();
	}, 5000);

	notification.addEventListener('click', () => {

		window.open('https://www.javascripttutorial.net/web-apis/javascript-notification/', '_blank');
	});
}

const checkForNewMessages = async () => {
	console.log("### fn checkForNewMessages triggered");
	console.time("checkForNewMessages");
	let chatsOld = [...chats];
	let lengthOld = chatsOld.length;
	await getUser();
	await getChats();
	await getConnectedUsers();
	let newMessages = 0;
	let chatsWithNewMessages = [];
	if (chats.length > 0) {
		chats.forEach(e => {
			let index = chatsOld.findIndex(el => el.id === e.id);
			if (index === -1) return;
			if (chatsOld[index].messages.at(-1)?.text.at(-1)[0] < e.messages.at(-1)?.text.at(-1)[0]) {
				newMessages += 1;
				chatsWithNewMessages.push(e.id);
			}
		});
	}
	if (newMessages > 0 || chats.length > lengthOld) {
		console.log("=== newMessages > 0 || chats.length > lengthOld ===");
		if (currentUser.config.audio === true) { audioIn.play(); }
		showNotification(lang("New messages!", "Neue Nachricht!"));
		renderOverview();
		highlightActiveOverviewItem();
	}
	if (newMessages > 0 && chatsWithNewMessages.some(e => e === currentChat.id)) {
		console.log("=== newMessages > 0 && chatsWithNewMessages.some(e => e === currentChat.id ===)");
		let text = taMessageInput.value;
		renderChat(currentChat.id);
		taMessageInput.value = text;
		taMessageInput.focus();
	}
	console.timeEnd("checkForNewMessages");
}

const searchTickerContacts = async (event) => {
	console.log("### => fn searchTickerContacts triggered");
	event.preventDefault();
	const inpNewChatSearchTickerContacts = document.querySelector("#inpNewChatSearchTickerContacts");
	const divNewChatSearchResults = document.querySelector("#divNewChatSearchResults");
	divNewChatSearchResults.classList.remove("slide-open");
	divNewChatSearchResults.innerHTML = "";
	if (inpNewChatSearchTickerContacts.value === "") {
		showAlert(lang("Please enter a name", "Bitte einen Namen eingeben"));
		return;
	}
	startLoader();
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ searchString: sanitize(inpNewChatSearchTickerContacts.value.trim()) }),
	};
	const response = await fetch("/ticker.searchUsers", options);
	let serverResponse = await response.json();
	let status = serverResponse.status;
	console.log({ status });
	if (!serverResponse.data || serverResponse.data === undefined || serverResponse.data === null) {
		stopLoader();
		showAlert(status);
		return;
	}
	let result = serverResponse.data;
	if (result.length === 0) {
		stopLoader();
		showAlert(lang("no matches found", "Keine Ergebnisse gefunden"));
		return;
	}
	stopLoader();
	result.forEach(e => {
		let userName = "";
		if (e[3] != "") {
			userName = `(${e[3]})`
		}
		divNewChatSearchResults.insertAdjacentHTML("beforeend", `
				<div class="searchResultItem" onclick="addNewChat('${e[0]}')">
					<p>${e[1]} ${e[2]} ${userName}<img src="pix/plus.webp" style="float: right; width: 24px;"</p>
				</div>
			`)
	});
	divNewChatSearchResults.classList.add("slide-open");
}


const inviteByEmail = async (event) => {
	console.log(`### => fn inviteByEmail triggered`);
	event.preventDefault();
	const inpNewChatInviteEmail = document.querySelector("#inpNewChatInviteEmail");
	let email = inpNewChatInviteEmail.value;
	if (emailRegex.test(email) === false) {
        showAlert(lang("email format is not correct", "E-Mail-Format ist nicht korrekt"));
        return;
    }
	let subjectEn = `${currentUser.firstName.at(-1)[2]} ${currentUser.lastName.at(-1)[2]} invites you to ticker`;
	let subjectDe = `${currentUser.firstName.at(-1)[2]} ${currentUser.lastName.at(-1)[2]} lädt dich zu ticker ein`;
	let styles = `		
		<style>
			body {
				background-color: hsl(30, 15%, 88%);
				color: hsl(30, 25%, 12%);
				font-size: 1.1rem;
				line-height: 1.2;
				margin: 0;
				padding: 25px;
				height: 100%;
			}
			img {
				float: right;
				width: 150px;
			}
		</style>
		`
	let bodyEn = styles + `
		<img src="https://fablog.eu/assets/logo_wide.png" alt="ticker logo" width="150">
		<br>
		<h1>Hello!</h1>
		<p>${currentUser.firstName.at(-1)[2]} uses <i><b>ticker</b></i>, a new messaging app and invites you to join in.</p>
		<h3><a href="https://app.fablog.eu/ticker/">app.fablog.eu/ticker</a></h3>
		<p>It's fun!</p>
		<p>And easy. No installation is required. Just use your favourite browser.</p>
		<p>Looking forward to seeing you soon</p>
		<p>With kind regards</p>
		<p>${currentUser.firstName.at(-1)[2]} and the ticker team</p>
		<p><small>Please do not reply to this email directly. If you have any questions or doubts, contact ${currentUser.firstName.at(-1)[2]} ${currentUser.lastName.at(-1)[2]} (${currentUser.email.at(-1)[2]})</small></p>
		<br>
        `;
	let bodyDe = styles + `
		<img src="https://fablog.eu/assets/logo_wide.png" alt="ticker logo" width="150">
		<br>
		<h1>Hallo!</h1>
		<p>${currentUser.firstName.at(-1)[2]} nutzt <i><b>ticker</b></i>, eine neue Messenger-App und möchte dich einladen, sie auszuprobieren.</p>
		<h3><a href="https://app.fablog.eu/ticker/">app.fablog.eu/ticker</a></h3>
		<p>Es macht Spaß!</p>
		<p>Und ist ganz einfach. Du musst nichts installieren und kannst einfach deinen Lieblingsbrowser benutzen.</p>
		<p>Wir würden uns freuen, dich bald begrüßen zu dürfen!</p>
		<p>Viele Grüße</p>
		<p>${currentUser.firstName.at(-1)[2]} und das ticker Team</p>
		<p><small>Bitte antworte nicht direkt auf diese Mail. Wenn du Fragen oder Bedenken hast, kontaktiere ${currentUser.firstName.at(-1)[2]} ${currentUser.lastName.at(-1)[2]} (${currentUser.email.at(-1)[2]})</small></p>
		<br>
        `;
	let data = {
		subject: lang(subjectEn, subjectDe),
		body: lang(bodyEn, bodyDe),
		recipientEmail: email
	}
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data),
	};
	const response = await fetch("/ticker.inviteByMail", options);
	let serverResponse = await response.json();
	let status = serverResponse.status;
	console.log({ status });
	if (status === "email exists") {
		showAlert(lang("User already uses ticker.<br>Try to find him or her using the <i>'search within ticker'</i> feature right above", "Diese NutzerIn ist bereits bei ticker<br>Versuche sie oder ihn mit der <i>'Bei ticker suchen'</i> Funktion direkt hier drüber zu finden."), 7500);
		return;
	}
	if (status != "OK") {
		showAlert(status);
		return;
	}
	showAlert(lang(`An email has been sent to ${email}<br>Thanks for spreading the word!`, `${email} hat eine Einladung bekommen<br>Danke fürs Bekanntmachen!`), 6000);
	closeModal();
}

const createNewGroup = async () => {
	const inpNewGroupName = document.querySelector("#inpNewGroupName");
	const inpNewGroupMember = document.querySelectorAll(".inpNewGroupMember");
	let participants = [[Date.now(), currentUser.id]];
	inpNewGroupMember.forEach(e => {
		if (e.checked) {participants.push([Date.now(), e.id])}
	});
	console.log({ participants });
	if (participants.length < 3) {
		showAlert(lang("Please choose at least two chat partners", "Bitte wähle mindestens zwei Chat-PartnerInnen"));
		return;
	}
	if (inpNewGroupName.value === "") {
		showAlert(lang("Please enter a group name", "Bitte gib einen Gruppennamen an"));
		inpNewGroupName.focus();
		return;
	}
	if (inpNewGroupName.value.length > 25) {
		showAlert(lang("Please choose a shorter group name", "Bitte wähle einen kürzeren Gruppennamen"));
		inpNewGroupName.focus();
		return;
	}
	let groupName = inpNewGroupName.value;
	
	startLoader();
	let newChat = {
		id: `chat_${Date.now()}_${randomCyphers(12)}`,
		participants,
		groupName,
		messages: [
		]
	}
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ newChat }),
	};
	const response = await fetch("/ticker.addNewChat", options);
	let serverResponse = await response.json();
	let status = serverResponse.status;
	console.log({ status });
	stopLoader();
	if (serverResponse.status != "OK") {
		showAlert(status);
		return;
	}
	currentUser = serverResponse.data;
	console.log(currentUser);
	// await getConnectedUsers();
	closeAllModals();
	chats.push(newChat);
	renderOverview();
	renderChat(newChat.id);
}

const renderModalNewGroup = (event) => {
	console.log("### fn renderModalNewGroup triggered");
	event.preventDefault();
	if (connectedUsers.length < 2) {
		showAlert(lang("You need to have at least 2 chat partners before creating a group.<br>Please try again later.", "Du musst mindestens 2 Kontakte haben, um eine Gruppe zu erstellen.<br>Bitte probier es später noch einmal."), 6000);
		return;
	}
	let connectedUsersList = "";
	connectedUsers.forEach(e => {
		let userName = "";
		if (e.userName != "") {
			userName = `(${e.userName})`;
		}
		connectedUsersList += `
			<div class="searchResultItem">
				<label for="${e.id}">
					<p>
					<input type="checkbox" class="inpNewGroupMember" id="${e.id}">
					${e.firstName} ${e.lastName} ${userName}
					</p>
				</label>
			</div>
			`;
	});
	modal.innerHTML = `
		<h3>${lang("New Group", "Neue Gruppe")}</h3>
		<p>${lang("Enter a group name", "Gib der Gruppe einen Namen")}</p>
		<input type="text" id="inpNewGroupName" placeholder="${lang("group name", "Gruppenname")}">
		<hr>
		<p>${lang("Select the users you want to add to the new group", "Wähle die NutzerInnen aus, die du der neuen Gruppe hinzufügen möchtest")}</p>
		${connectedUsersList}<br>
		<hr>
		<button type="button" onclick="closeModal(); showHeaderIcons()">${lang("dismiss", "abbrechen")}</button>
		<button type="submit" onclick="createNewGroup()">${lang("create group", "Gruppe anlegen")}</button>
		<div class="camouflage"></div>
	`;
}

const renderModalNewChat = () => {
	toggleModal();
	modal.innerHTML = `
		<img src="pix/x.webp" alt="close" title="close" class="close-modal icon" onclick="closeModal()">
		<h3>${lang('New Chat', 'Neue Unterhaltung')}</h3>
		<hr>
		<form>
			<h4>${lang("Search within ticker", "Bei ticker suchen")}</h4>
			<p>${lang("Check if your friends already use ticker. You can search by name or email address.", "Sieh' nach, ob Freunde von dir schon bei ticker sind. Du kannst nach Namen oder E-Mail-Adressen suchen.")}</p>
			<input type="text" placeholder="${lang("search within ticker", "Bei ticker suchen")}" id="inpNewChatSearchTickerContacts">
			<button type="submit" onclick="searchTickerContacts(event)">${lang("search", "suchen")}</button>
			<div id="divNewChatSearchResults"></div>
		</form>
		<hr>
		<form>
			<h4>${lang("Invite by email", "Per E-Mail einladen")}</h4>
			<p>${lang("Send a message to a friend and ask if they want to try out ticker.", "Schicke einer FreundIn eine Einladung zu ticker.")}</p>
			<input type="email" placeholder="${lang("email", "E-Mail-Adresse")}" id="inpNewChatInviteEmail">
			<button type="submit" onclick="inviteByEmail(event)">${lang("invite", "einladen")}</button>
		</form>
		<hr>
		<h4>${lang("Create new group", "Neue Gruppe erstellen")}</h4>
		<p>${lang("Chat with multiple friends at the same time.", "Chatte mit mehreren gleichzeitig.")}</p>
		<button type="button" onclick="renderModalNewGroup(event)">${lang("create", "erstellen")}</button>
		<div class="camouflage"></div>
	`;
}