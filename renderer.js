window.addEventListener('DOMContentLoaded', () => {

    document
        .getElementById('loginBtn')
        .addEventListener('click', login);
});

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');
    const result = await window.auth.validateLocalLogin(username, password);

    if (result.success) {
        localStorage.setItem('token', result.token);

        message.innerText = 'Login successful (offline)';
        message.style.color = 'green';

        window.location.href = 'dashboard.html';
        return;
    }

    try {
        const apiResult = await window.auth.login(username, password);

        if (apiResult.success) {
            localStorage.setItem('token', apiResult.data);
            const token = localStorage.getItem('token');

            message.innerText = 'Login successful (online)';
            message.style.color = 'green';

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            message.innerText = apiResult.message;
            message.style.color = 'red';
        }
    } catch (err) {
        message.innerText = 'Unexpected error: ' + err.message;
        message.style.color = 'red';
    }
}