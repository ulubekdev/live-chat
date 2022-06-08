submitButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const userimg = uploadInput.files[0];

    if (!username || !password || !userimg) {
        alert('Please fill in the required fields');
        return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('userimg', userimg);

    let response = await fetch('/register', {
        method: 'POST',
        body: formData
    });

    response = await response.json();

    if (response.status === 201) {
        window.location.href = '/';
        window.localStorage.setItem('token', response.token);
    } else {
        messageText.textContent = response.message;
    }

});

showButton.onclick = () => {
    if (showButton.classList.contains('zmdi-eye')) {
        showButton.classList.remove('zmdi-eye')
        showButton.classList.add('zmdi-eye-off')
        passwordInput.type = 'text'
    } else {
        showButton.classList.remove('zmdi-eye-off')
        showButton.classList.add('zmdi-eye')
        passwordInput.type = 'password'
    }
}