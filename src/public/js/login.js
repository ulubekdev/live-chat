submitButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if(!username || !password) {
        messageText.textContent = 'Please fill in the required fields';
        return;
    }

    let response = await request('/login', 'POST', {
        username,
        password
    });

    if(response.status === 200) {
        window.location.href = '/';
        window.localStorage.setItem('token', response.token);
    } else {
        messageText.textContent = response.message;
    }
})







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