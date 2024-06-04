document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        signupUser(email, password);
    });

    const redirectToSignUpButton = document.getElementById('redirect-to-login');
    redirectToSignUpButton.addEventListener('click', redirectToLogin);
});

function signupUser(email, password) {
    localStorage.setItem(email, password);
    localStorage.setItem(`${email}_playlists`, JSON.stringify({}));
    window.location.href = '/login/login.html';
}

function redirectToLogin() {
    window.location.href = '/login/login.html';
}