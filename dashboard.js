const ctx = document.getElementById('myChart');

// “When the dashboard page finishes loading, run the dashboard() function.”
window.addEventListener('DOMContentLoaded', dashboard);

async function dashboard() {
    await loadNavbar();
    handleLogout();

    const message = document.getElementById('message');

    try {
        const token = localStorage.getItem('token');

        if (!token) {
            showError(message, 'No token found');
            return;
        }

        const result = await window.auth.getDashboard(token);

        if (result.success) {
            renderDonut(result.data.chartDonut);
            renderBar(result.data.chartBar);
            renderTable(result.data.tableUsers);
        } else {
            showError(message, result.message);
        }

    } catch (err) {
        showError(message, 'Unexpected error occurred');
        console.log(err);
    }
}

async function loadNavbar() {
    const html = await fetch('./navbar.html').then(r => r.text());
    document.getElementById('navbar-container').innerHTML = html;
}

function handleLogout() {
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
}

function renderDonut(donutData) {
    new Chart(document.getElementById('donutChart'), {
        type: 'doughnut',
        data: {
            labels: donutData.map(i => i.name),
            datasets: [{
                data: donutData.map(i => i.value),
                backgroundColor: ['#4CAF50', '#F44336', '#FFC107', '#2196F3']
            }]
        }
    });
}

function renderBar(barData) {
    new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: barData.map(i => i.name),
            datasets: [{
                label: 'Users',
                data: barData.map(i => i.value),
                backgroundColor: '#2196F3'
            }]
        }
    });
}

function renderTable(users) {
    const tbody = document.querySelector('#userTable tbody');
    tbody.innerHTML = '';

    let i = 1;

    users.forEach(user => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${i++}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.username}</td>
        `;

        tbody.appendChild(row);
    });
}

function showError(element, message) {
    element.innerText = message;
    element.style.color = 'red';
}