document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const resetPasswordForm = document.getElementById('reset-password-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            loginUser(email, password);
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            signupUser(email, password);
        });
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('forgot-email').value;
            sendResetPasswordEmail(email);
        });
    }

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const email = new URLSearchParams(window.location.search).get('email');
            resetPassword(email, newPassword, confirmPassword);
        });
    }
});

function loginUser(email, password) {
    const storedPassword = localStorage.getItem(email);
    if (storedPassword === password) {
        localStorage.setItem('authenticated', 'true');
        localStorage.setItem('loggedInUser', email);
        window.location.href = '/src/index.html';
    } else {
        alert('Invalid email or password');
    }
}

function signupUser(email, password) {
    localStorage.setItem(email, password);
    localStorage.setItem(`${email}_playlists`, JSON.stringify({})); // Initialize empty playlists
    console.log(email, password)
    window.location.href = '/src/login/login.html';
}

function sendResetPasswordEmail(email) {
    if (localStorage.getItem(email)) {
        window.location.href = `reset-password.html?email=${email}`;
    } else {
        alert('Email not found');
    }
}

function resetPassword(email, newPassword, confirmPassword) {
    if (newPassword === confirmPassword) {
        localStorage.setItem(email, newPassword);
        alert('Password reset successfully');
        window.location.href = 'login.html';
    } else {
        alert('Passwords do not match');
    }
}
