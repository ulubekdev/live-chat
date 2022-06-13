let lastSelectedUserId = window.localStorage.getItem('lastSelectedUserId');

const socket = io({
    auth: {
        token: window.localStorage.getItem('token')
    }
})

async function getAllUsers() {
    let users = await request('/users', 'GET');
    renderUsers(users.data);
}

async function getMessages(userId) {
    const messages = await request(`/messages?userId=${userId}`, 'GET');
    renderMessages(messages.data, userId);
}

async function updateMessage(event, element, messageId) {
    if(!updateMessage.cacheText) {
        updateMessage.cacheText = element.textContent;
    }

    if(event.keyCode !== 13) return;

    element.textContent = element.textContent.trim();
    element.blur();

    if(!element.textContent.length) {
        element.textContent = updateMessage.cacheText;
        updateMessage.cacheText = null;
        return;
    }

    await request('/messages/' + messageId, 'PUT', {
        message_content: element.textContent
    })
    updateMessage.cacheText = null;
}

async function deleteMessage(element, event, messagaId) {
    const response = await request('/messages/' + messagaId, 'DELETE')
    if (response.status === 200) {
        element.parentNode.remove();
    }
}

async function postMessage(message, type) {
    if(type === 'text' && lastSelectedUserId) {
        const response = await request('/messages', 'POST', {
            message_to: lastSelectedUserId,
            message_content: message,
        });

        if(response.status === 200) {
            renderMessages([response.data], lastSelectedUserId);
        }
    } else {
        const formData = new FormData();
        formData.append('message_to', lastSelectedUserId);
        formData.append('file', message);

        const response = await request('/messages', 'POST', formData);

        if(response.status === 200) {
            renderMessages([response.data], lastSelectedUserId);
        }
    }

}

async function renderUsers(users) {
    chatsList.innerHTML = '';
    for (let user of users) {
        const userImg = new String(`/file/${token}/${user.userimg}`)

        chatsList.innerHTML += `
            <li class="chats-item" onclick="(async function () {
                window.localStorage.setItem('lastSelectedUserId', ${user.user_id})
                chatPhoto.src = '${userImg}'
                chatUser.textContent = '${user.username}'

                formMessage.style.display = 'flex'
                chatsMain.innerHTML = null
                uploadedFiles.innerHTML = null
                await getMessages(${user.user_id})
            })()">
                <img src="${userImg}" alt="profile-picture">
                <p>
                    ${user.username}
                    <span data-actionid="${user.user_id}"></span>
                    <span data-id="${user.user_id}" class="indicator ${user.socket_id ? 'online-indicator' : ''}">
                    </span>
                </p>
            </li>
        `
    }
}

async function renderMessages(messages, myId) {
    for (let message of messages) {
        const isMyMessage = message.message_from.user_id == myId;

        const img = '/file/' + token + '/' + message.message_from.userimg;
        const filee = '/filee/' + token + '/' + message.message_content;
        const downloadLink = '/download/' + token + '/' + message.message_content;
        const username = message.message_from.username;

        const date = new Date(message.createdAt);
        const hour = date.getHours().toString().padStart(2, 0);
        const minute = date.getMinutes().toString().padStart(2, 0);
        const time = hour + ':' + minute;

        const div = document.createElement('div');
        div.dataset.id = message.message_id;
        div.classList.add('msg-wrapper');
        !isMyMessage && div.classList.add('msg-from');

        if (message.message_type === 'plain/text') {
            div.innerHTML += `
                <img src="${img}" alt="profile-picture">
                <div class="msg-text">
                    <p class="msg-author">${username}</p>
                    <p class="msg" onkeydown="updateMessage(event, this, ${message.message_id})" ${!isMyMessage ? 'contentEditable' : null}>${message.message_content}</p>
                    <p class="time">${time}</p>
                </div>
                <img onclick="deleteMessage(this, event, ${message.message_id})" class="delete-icon ${!isMyMessage ? 'delete-icon-active' : ''}" src="https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Close_Icon_Dark-512.png">
            `
        } else {
            uploadedFiles.innerHTML += `
                <li class="uploaded-file-item">
                    <a target="__blank" href="${filee}">
                        <img src="./img/file.png" alt="file" width="30px">
                        <p>${message.message_content}</p>
                    </a>
                </li>
            `

            div.innerHTML += `
                <img src="${img}" alt="profile-picture">
                <div class="msg-text">
                    <p class="msg-author">${username}</p>
                    <object stopped data="${filee}" type="${message.message_type}" class="msg object-class"></object>
                    <a href="${downloadLink}">
                        <img src="./img/download.png" width="25px">
                    </a>
                    <p class="time">${time}</p>
                </div>
                <img onclick="deleteMessage(this, event, ${message.message_id})" class="delete-icon ${!isMyMessage ? 'delete-icon-active' : ''}" src="https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Close_Icon_Dark-512.png">
            `
        }
        chatsMain.append(div);
    }
    chatsMain.scrollTop = chatsMain.scrollHeight;
}


formMessage.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = textInput.value.trim();

    if(!message) {
        return textInput.value = '';
    }

    if(message.includes('<') && message.includes('>')) {
        return textInput.value = '';
    }
    postMessage(message, 'text');
    formMessage.reset();
});

uploadsInput.addEventListener('change', (e) => {
    const file = uploadsInput.files[0];

    if(file.size > 1024 * 1024 * 50) {
        return alert('File size is too big');
    }

    socket.emit('message-file', { to: lastSelectedUserId });

    postMessage(file, 'file');
    uploadsInput.reset();
});

let timeOutId;
textInput.onkeyup = event => {
    if(event.keyCode === 13) {
        timeOutId = undefined;
        socket.emit('message-stop', { to: lastSelectedUserId });
    }

    if(timeOutId) return

    socket.emit('message-typing', { to: lastSelectedUserId });

    timeOutId = setTimeout(() => {
        timeOutId = undefined;
        socket.emit('message-stop', { to: lastSelectedUserId })
    }, 2000);
}

async function userInfo() {
    profileAvatar.src = '/avatar/' + token;
    let response = await request('/username/' + token);
    profileUsername.textContent = response.username;
}

logOut.onclick = () => {
    window.localStorage.clear();
    window.location = '/login';
}

userInfo();
getAllUsers();

socket.on('user-exit', () => {
    window.localStorage.clear();
    window.location = '/login';
});

socket.on('user-online', ({ user_id }) => {
    const span = document.querySelector(`[data-id='${user_id}']`);
    span.classList.add('online-indicator')
});

socket.on('user-offline', ({ user_id }) => {
    const span = document.querySelector(`[data-id='${user_id}']`);
    span.classList.remove('online-indicator')
})

socket.on('new-message', (message) => {
    renderMessages([message], lastSelectedUserId);
});

socket.on('message-typing', ({ to, from }) => {
    lastSelectedUserId = +lastSelectedUserId;
    if(lastSelectedUserId === from) {
        chatStatus.textContent = 'typing...';
    }
});

socket.on('message-stop', ({ to, from }) => {
    lastSelectedUserId = +lastSelectedUserId;
    if(lastSelectedUserId === from) {
        chatStatus.textContent = null;
    }
});

socket.on('message-file', ({ from }) => {
    if(lastSelectedUserId === from) {
        chatStatus.textContent = 'send file...';
    }
})

socket.on('message-update', ({ message_id, message_content }) => {
    const p = document.querySelector(`[data-id='${message_id}']`).querySelector('.msg');
    p.textContent = message_content;
})

socket.on('message-delete', ({ message_id, message_from }) => {
    const div = document.querySelector(`[data-id='${message_id}']`);
    if(lastSelectedUserId == message_from.user_id && div) {
        div.remove();
    }
})