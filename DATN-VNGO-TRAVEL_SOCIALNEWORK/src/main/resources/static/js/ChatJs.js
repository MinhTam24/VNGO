document.addEventListener('DOMContentLoaded', () => {
	connect();
});


const connectedUsersList = document.querySelector('#connectedUsers');
const messageBox = document.querySelector('#messageBox');
const messageInput = document.querySelector('#messageInput');
const sendMessageButton = document.querySelector('#sendMessage');

const token = localStorage.getItem('token');
let account = null;
let stompClient = null;

async function checkToken() {
	try {
		const response = await fetch('http://localhost:8080/api/account', {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			account = await response.json();
			console.log('User Info:', account);
		} else {
			console.error('Invalid token or unauthorized');
		}
	} catch (error) {
		console.error('Error checking token:', error);
	}
}

async function connect() {
	await checkToken();
	if (account) {
		console.log(`User ${account.fullName} connected.`);
		const socket = new SockJS('/ws');
		stompClient = Stomp.over(socket);

		stompClient.connect({}, onConnected, onError);
	}

}

function onConnected() {
	stompClient.subscribe(`/user/${account.id}/queue/messages`, onMessageReceived);
	stompClient.subscribe(`/topic/public`, onMessageReceived);

	findAndDisplayConnectedUsers().then(() => {
		console.log('Connected users displayed.');
	});
}

function onError(error) {
	console.error('WebSocket connection error:', error);
}

async function findAndDisplayConnectedUsers() {
	try {
		const response = await fetch('/api/users', {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			let connectedUsers = await response.json();
			connectedUsers = connectedUsers.filter(user => user.id !== account.id);

			connectedUsersList.innerHTML = '';
			connectedUsers.forEach(user => appendUserElement(user));
		} else {
			console.error('Failed to fetch connected users');
		}
	} catch (error) {
		console.error('Error fetching connected users:', error);
	}
}

function appendUserElement(user) {
	const userElement = document.createElement('div');
	userElement.textContent = user.fullName;
	userElement.className = 'border-bottom py-1';
	connectedUsersList.appendChild(userElement);
}

function onMessageReceived(payload) {
	const message = JSON.parse(payload.body);
	const messageElement = document.createElement('div');
	messageElement.textContent = `${message.sender}: ${message.content}`;
	messageBox.appendChild(messageElement);
}

sendMessageButton.addEventListener('click', () => {
	const message = messageInput.value.trim();
	if (message && stompClient) {
		const chatMessage = {
			sender: account.fullName,
			content: message,
			type: 'SENT'
		};
		stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
		messageInput.value = '';
	}
});
