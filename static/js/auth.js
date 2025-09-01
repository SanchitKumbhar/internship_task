        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const loginToggle = document.getElementById('login-toggle');
        const signupToggle = document.getElementById('signup-toggle');

        // Function to switch between login and signup forms
        function switchForm(formName) {
            if (formName === 'login') {
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
                loginToggle.classList.add('active');
                signupToggle.classList.remove('active');
            } else {
                loginForm.classList.remove('active');
                signupForm.classList.add('active');
                loginToggle.classList.remove('active');
                signupToggle.classList.add('active');
            }
        }

        // Password matching validation logic
        const passwordInput = document.getElementById('signup-password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const passwordMessage = document.getElementById('password-message');
        const signupBtn = document.getElementById('signup-btn');

        function validatePassword() {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (password.length > 0 || confirmPassword.length > 0) {
                if (password === confirmPassword) {
                    passwordMessage.textContent = '✅ Passwords match!';
                    passwordMessage.className = 'match';
                    confirmPasswordInput.style.borderColor = 'var(--success-color)';
                    signupBtn.disabled = false;
                } else {
                    passwordMessage.textContent = '❌ Passwords do not match!';
                    passwordMessage.className = 'no-match';
                    confirmPasswordInput.style.borderColor = 'var(--danger-color)';
                    signupBtn.disabled = true;
                }
            } else {
                passwordMessage.textContent = '';
                confirmPasswordInput.style.borderColor = '#ccc';
                signupBtn.disabled = false;
            }
        }

        // Add event listeners to check passwords on input
        passwordInput.addEventListener('keyup', validatePassword);
        confirmPasswordInput.addEventListener('keyup', validatePassword);

        // Prevent form submission if passwords don't match
        
