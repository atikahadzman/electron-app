const ctx = document.getElementById('myChart');

// “When the dashboard page finishes loading, run the dashboard() function.”
window.addEventListener('DOMContentLoaded', dashboard);

async function dashboard() {
    const message = document.getElementById('message');

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            message.innerText = 'No token found';
            message.style.color = 'red';
            return;
        }

        const result = await window.auth.getDashboard(token);
        console.log(result);
        console.log('Chart is:', window.Chart);
        if (result.success) {
            const donutData = result.data.chartDonut;
            const barData = result.data.chartBar;
            const tableUsers = result.data.tableUsers;

            // donut chart
            const labelDonut = donutData.map(item => item.name);
            const valueDonut = donutData.map(item => item.value);
            new Chart(document.getElementById('donutChart'), {
                type: 'doughnut',
                data: {
                    labels: labelDonut,
                    datasets: [{
                        data: valueDonut,
                        backgroundColor: [
                            '#4CAF50',
                            '#F44336',
                            '#FFC107',
                            '#2196F3'
                        ]
                    }]
                }
            });

            // bar chart
            const labelBar = barData.map(item => item.name);
            const valueBar = barData.map(item => item.value);
            new Chart(document.getElementById('barChart'), {
                type: 'bar',
                data: {
                    labels: labelBar,
                    datasets: [{
                        label: 'Users',
                        data: valueBar,
                        backgroundColor: '#2196F3'
                    }]
                }
            });

            // user table
            const tbody = document.querySelector('#userTable tbody');
            tbody.innerHTML = ''; // clear old rows
            tableUsers.forEach(user => {
                const row = document.createElement('tr');
                let i = 1;
                row.innerHTML = `
                    <td>${i++}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.username}</td>
                `;
                tbody.appendChild(row);
            });
        } else {
            message.innerText = result.message;
            message.style.color = 'red';
        }
    } catch (err) {
        message.innerText = 'Unexpected error occurred';
        message.style.color = 'red';
        console.error(err);
    }
}