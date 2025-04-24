const token = localStorage.getItem('token');
const email = localStorage.getItem('email');
let authId = null;
let stompClient = null;
let selectedUserId = null;
const messageInput = document.getElementById('messageInput');
const chatArea = document.getElementById('ChatArea');
const sendButton = document.getElementById('sendButton');

document.addEventListener("DOMContentLoaded", function () {
    checkTokenAndGetUserInfo();
});

async function checkTokenAndGetUserInfo() {
    if (token == null) {
        alert('Bạn cần đăng nhập để truy cập trang admin');
        window.location.href = '/login';
        return;
    }

    const response = await fetch(`http://localhost:8080/api/account/email/${email}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
        document.getElementById('user-email').innerText = data.email;
    } else {
        alert('Token không hợp lệ');
    }
    AuthUser(token);
    await getUser(token);
    connect();
}

async function AuthUser(token) {
    try {
        const response = await fetch('http://localhost:8080/api/auth/user-id', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            authId = await response.json(); // Gán giá trị authId từ API
        } else {
            console.error('Failed to fetch user ID:', response.statusText);
        }
    } catch (error) {
        console.error('Error in AuthUser:', error);
    }
}

async function getUser(token) {
    try {
        const response = await fetch('http://localhost:8080/api/account', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            const listUser = document.getElementById('user-email');
            const fragment = document.createDocumentFragment();

            if (Array.isArray(data)) {
                data.forEach(user => {
                    if (user.id != authId) {
                        const li = document.createElement("li");
                        const a = document.createElement("a");
                        a.href = "#";
                        a.textContent = user.fullName;
                        a.setAttribute("data-id", user.id);
                        a.addEventListener("click", function (event) {
                            openChatWithUser(event, user);
                        });
                        li.appendChild(a);
                        fragment.appendChild(li);
                    }
                });
            }

            listUser.appendChild(fragment);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function connect() {
    const socket = new SockJS("/ws");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
}

function onConnected() {
    console.log("Connected to WebSocket")
    stompClient.subscribe(`/user/${authId}/queue/messages`, onMessageReceived)

}

function openChatWithUser(event, user) {
    const clickedUser = event.currentTarget;
    selectedUserId = clickedUser.getAttribute('data-id');
    findAndDisplayUserChat(selectedUserId, authId).then();
}

async function findAndDisplayUserChat(selectedUserId, authId) {
    try {
        const userChatResponse = await fetch(`/messages/${authId}/${selectedUserId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!userChatResponse.ok) {
            if (userChatResponse.status === 404) {
                chatArea.innerHTML = '<p>No messages found.</p>';
                return;
            }
            throw new Error(`Error: ${userChatResponse.status} ${userChatResponse.statusText}`);
        }

        const textResponse = await userChatResponse.text();
        if (!textResponse) {
            console.error('Response body is empty');
            chatArea.innerHTML = '<p>Unable to load messages. No data returned.</p>';
            return;
        }

        const userChat = JSON.parse(textResponse);

        chatArea.innerHTML = '';
        if (userChat.length === 0) {
            chatArea.innerHTML = '<p>No messages to display.</p>';
            return;
        }

        userChat.forEach(chat => {
            displayMessage(chat.senderId, chat.content);
        });

        chatArea.scrollTop = chatArea.scrollHeight;
    } catch (error) {
        console.error('Failed to load chat messages:', error);
        chatArea.innerHTML = '<p>Unable to load messages. Please try again later.</p>';
    }
}




function displayMessage(senderId, content) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    if (senderId == authId) {
        messageContainer.classList.add('sender');
    } else {
        messageContainer.classList.add('receiver');
    }
    const message = document.createElement('p');
    message.textContent = content;
    messageContainer.appendChild(message);
    chatArea.appendChild(messageContainer);
    chatArea.scrollTop = chatArea.scrollHeight;

}



async function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    console.log('Message_SENDER:', message.senderId);

    if (message.senderId == selectedUserId || message.recipientId == selectedUserId) {
        displayMessage(message.senderId, message.content);
        chatArea.scrollTop = chatArea.scrollHeight;
    } else {
        console.log(`Message ignored as it's not for the selected user. Sender: ${message.senderId}`);
    }
}



function sendMessage(event) {
    const messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        const chatMessage = {
            senderId: authId,
            recipientId: selectedUserId,
            content: messageContent,
            sentAt: new Date(),
            status: 'SENT'
        }
        stompClient.send("/app/chat", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }, JSON.stringify(chatMessage));
        displayMessage(authId, messageContent);
        messageInput.value = '';
    }
    chatArea.scrollTop = chatArea.scrollHeight;
    event.preventDefault();
}


sendButton.addEventListener('click', sendMessage);



function onError() {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}







