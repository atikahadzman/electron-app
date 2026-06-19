window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginBtn').addEventListener('click', login);
});

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    if (!username || !password) {
        if (message) {
            message.innerText = 'Username and password are required';
            message.style.color = 'red';
        }
        console.log('Username and password are required');
        return;
    }

    try {
        const result = await window.auth.login(username, password);
        console.log('result: ' + JSON.stringify(result));
        console.log('success: ' + JSON.stringify(result.success));
        console.log('token: ' + JSON.stringify(result.data));

        if (result.success) {
            if (result.data) localStorage.setItem('token', result.data);

            if (message) {
                message.innerText = 'Login successful';
                message.style.color = 'green';
            }

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            console.log(result.message);
            if (message) {
                message.innerText = result.message;
                message.style.color = 'red';
            }
        }
    } catch (err) {
        if (message) {
            message.innerText = 'Unexpected error occurred: ' + JSON.stringify(err);
            message.style.color = 'red';
        }
    }
}