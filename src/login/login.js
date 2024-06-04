document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        loginUser(email, password);
    });

    const redirectToSignUpButton = document.getElementById('redirect-to-signup');
    redirectToSignUpButton.addEventListener('click', redirectToSignUp);
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

function redirectToSignUp() {
    window.location.href = '/src/signup/signup.html';
}