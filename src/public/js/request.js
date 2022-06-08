async function request(path, method, body) {
    try {
        const headers = {
            token: window.localStorage.getItem('token')
        }

        if (!(body instanceof FormData)) {
            body = JSON.stringify(body)
            headers['Content-Type'] = 'application/json'
        }

        let response = await fetch(path, {
            method: method || 'GET',
            headers,
            body,
        })

        if (response.status === 403) {
            window.localStorage.clear()
            window.location = '/login'
        }

        return await response.json()

    } catch (error) {
        console.log(error)
    }
}