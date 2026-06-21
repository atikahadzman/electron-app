const ctx = document.getElementById('myChart');

// “When the dashboard page finishes loading, run the dashboard() function.”
window.addEventListener('DOMContentLoaded', dashboard);

/**
 * 
 * 1. try offline first
 * 2. if no local data, fetch from API
 * 3. render dashboard page
 */
async function dashboard() {
    await loadNavbar();
    handleLogout();

    const message = document.getElementById('message');
    const token = localStorage.getItem('token');

    let result;
    result = await window.auth.getLocalDashboard();
    if (!result.success) {
        result = await window.auth.getDashboard(token);
  
        if (result.success) {
            await window.auth.saveDashboard(result.data);
        }
    }

    const data = result.data;

    if (!data) {
        showError(message, 'No dashboard data available');
        return;
    }

    renderDonut(data.chartDonut);
    renderBar(data.chartBar);
    renderTable(data.tableUsers);
}

async function loadNavbar() {
    const html = await fetch('./navbar.html').then(r => r.text());
    document.getElementById('navbar-container').innerHTML = html;
}

function handleLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    const email = window.config.userEmail;

    logoutBtn?.addEventListener('click', async () => {
        try {
            localStorage.removeItem('token');
            await window.auth.deleteUser(email);
            await window.auth.deleteDashboard('dashboard');

            window.location.href = 'index.html';

        } catch (err) {
            console.error('Logout error:', err);
        }
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