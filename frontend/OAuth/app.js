document.getElementById('register-link').addEventListener('click', (e) => {
		e.preventDefault();
		document.getElementById('login-page').style.display = 'none';
		document.getElementById('register-page').style.display = 'block';
	});
	
	document.getElementById('register-form').addEventListener('input', () => {
		const password = document.getElementById('register-password').value;
		const confirmPassword = document.getElementById('register-confirm-password').value;
		if (password !== confirmPassword) {
			document.getElementById('register-confirm-password').style.border = '1px solid red';
			document.getElementById('password-match-error').style.display = 'inline';
		} else {
			document.getElementById('register-confirm-password').style.border = '';
			document.getElementById('password-match-error').style.display = 'none';
		}
	});
	
	document.getElementById('register-form').addEventListener('submit', (e) => {
		e.preventDefault();
		const username = document.getElementById('register-username').value;
		const email = document.getElementById('register-email').value;
		const password = document.getElementById('register-password').value;
		const confirmPassword = document.getElementById('register-confirm-password').value;
		if (password !== confirmPassword) {
			alert('Passwords do not match');
			return;
		}
		if (!validateEmail(email)) {
			alert('Invalid email address');
			return;
		}
		// Add your registration logic here
		console.log(`Username: ${username}, Email: ${email}, Password: ${password}`);
	});
	
	function validateEmail(email) {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	}

	document.getElementById('login-link').addEventListener('click', (e) => {
		e.preventDefault();
		document.getElementById('register-page').style.display = 'none';
		document.getElementById('login-page').style.display = 'block';
	});

	function onSignIn(googleUser) {
		var profile = googleUser.getBasicProfile();
		console.log('ID: ' + profile.getId());
		console.log('Name: ' + profile.getName());
		console.log('Image URL: ' + profile.getImageUrl());
		console.log('Email: ' + profile.getEmail());
		// Your authentication logic here
	}