document.getElementById('loginForm').addEventListener('submit', function(event) {
	event.preventDefault();

	const email = document.getElementById('username').value;
	const passWord = document.getElementById('password').value;
	login(email, passWord);
});

async function login(email, passWord) {
	try {
		const response = await fetch('http://localhost:8080/api/login', { // Thêm "http://"
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, passWord })
		});

		const data = await response.json();
        console.log('Response:', data);
		if (response.ok) {
			localStorage.setItem('token', data.token); // Lưu token vào localStorage
            localStorage.setItem('email', email);
            window.location.href = `/user/home`;
			alert('Login success: ' + data.token);
		} else {
			alert('Login failed: ' + (data.message || 'Unknown error'));
		}
	} catch (error) {
		console.error('Lỗi kết nối:', error);
		alert('Không thể kết nối đến server.');
	}
}
