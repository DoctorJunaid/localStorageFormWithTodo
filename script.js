let users = JSON.parse(localStorage.getItem('users')) || [];

// --------------------------
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    checkForNotifications();
    if (loginForm && registerForm) {
        const currentUser = JSON.parse(localStorage.getItem('obj'));
        if (currentUser && currentUser.email) {
            showNotification('You are already logged in. Redirecting to home page...', 'info');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);
            return;
        }
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            if (!email || !password) {
                showNotification('Please fill in all fields', 'warning');
                return;
            }
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                localStorage.setItem('obj', JSON.stringify(user));
                
                // Initialize empty todos array for new users if they don't have one yet
                const todoKey = `todos_${email}`;
                if (!localStorage.getItem(todoKey)) {
                    localStorage.setItem(todoKey, JSON.stringify([]));
                }
                
                showNotification('Login successful! Redirecting to home page...', 'success');
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } else {
                showNotification('Invalid email or password. Please try again.', 'danger');
            }
        });
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            if (!name || !email || !password || !confirmPassword) {
                showNotification('Please fill in all fields', 'warning');
                return;
            }
            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', 'danger');
                return;
            }
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                showNotification('User with this email already exists!', 'warning');
                return;
            }
            const newUser = {
                name: name,
                email: email,
                password: password
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('obj', JSON.stringify(newUser));
            
            // Initialize empty todos array for new users
            const todoKey = `todos_${email}`;
            localStorage.setItem(todoKey, JSON.stringify([]));
            
            showNotification('Registration successful! Redirecting to home page...', 'success');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);
        });
    }
});

// --------------------------
function showNotification(message, type) {
    const alertContainer = document.querySelector('.alert-container');
    if (!alertContainer) return;
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alert);
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            alertContainer.removeChild(alert);
        }, 300);
    }, 5000);
}

// --------------------------
function checkForNotifications() {
    const notification = JSON.parse(sessionStorage.getItem('notification'));
    if (notification) {
        showNotification(notification.message, notification.type);
        sessionStorage.removeItem('notification');
    }
}