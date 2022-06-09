const lastSelectedUserId = () => window.localStorage.getItem('lastSelectedUserId');
let selected;

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

async function renderUsers(users) {
    chatsList.innerHTML = '';
    for (let user of users) {
        const userImg = new String(`/file/${token}/${user.userimg}`)

        chatsList.innerHTML += `
            <li class="chats-item" onclick="(async function () {
                window.localStorage.setItem('lastSelectedUserId', ${user.user_id})
                selected = true
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
                    <span data-actionid="${user.user_id}" id="chatStatus"></span> 
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
        div.classList.add('msg-wrapper');
        !isMyMessage && div.classList.add('msg-from');

        if (message.message_type === 'plain/text') {
            div.innerHTML += `
                <img src="${img}" alt="profile-picture">
                <div class="msg-text">
                    <p class="msg-author">${username}</p>
                    <p class="msg" onkeydown="updateMessage(event, this, ${message.message_id})" contenteditable="true">${message.message_content}</p>
                    <p class="time">${time}</p>
                </div>
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
            `
        }
        chatsMain.append(div);
    }
    chatsMain.scrollTop = chatsMain.scrollHeight;
}

async function postMessage(message, type) {
    if(type === 'text' && lastSelectedUserId()) {
        const response = await request('/messages', 'POST', {
            message_to: lastSelectedUserId(),
            message_content: message,
        });

        if(response.status === 200) {
            renderMessages([response.data], lastSelectedUserId());
        }
    } else {
        const formData = new FormData();
        formData.append('message_to', lastSelectedUserId());
        formData.append('file', message);

        const response = await request('/messages', 'POST', formData);

        if(response.status === 200) {
            renderMessages([response.data], lastSelectedUserId());
        }
    }

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
})

uploadsInput.addEventListener('change', (e) => {
    const file = uploadsInput.files[0];
    if(file.size > 1024 * 1024 * 50) {
        return alert('File size is too big');
    }

    postMessage(file, 'file');
    uploadsInput.reset();
})

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