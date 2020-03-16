const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <style>
        body {
            border: 10px dashed dodgerblue;
            font-family: sans-serif;
            font-size: 1.5rem;
            padding: 2rem;
        }
    </style>
</head>
<body>

<!-- TODO https://stackoverflow.com/questions/26340275/where-to-save-a-jwt-in-a-browser-based-application-and-how-to-use-it
 Probably easiest to use
localStorage.setItem('token', 'asY-x34SfYPk'); // write
console.log(localStorage.getItem('token')); // read
 -->

<!-- is send to /auth/login -->
<form id="form">
    <input type="text" name="username" id="username">
    <input type="password" name="password" id="password">
    <input type="submit">
</form>

<button id="logout">Log out</button>

<h2>Some endpoints</h2>

<ul>
    <li><a href="/api/cats">/api/cats</a> <button id="cats">get</button></li>
    <li><a href="/api/foo">/api/foo</a> <button id="foo">get</button></li>
    <li><a href="/api/profile">/api/profile</a> <button id="profile">get</button></li>
</ul>

<script>
  // TODO do this on the server with an old fashioned POST?
  document.getElementById("form").addEventListener('submit', (ev) => {
    ev.preventDefault();
    fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      })
    })
      .then(data => data.json())
      .then(data => {
        console.log(data);
        localStorage.setItem('token', data.access_token);
      })
  });

  document.getElementById('logout').addEventListener('click', (ev) => {
    localStorage.removeItem('token');
    // TODO Logout: also invalidate on the server!
  });
  // TODO JWT is good for APIs, not sessions. Is it good for WebSocket/FTP update?

  document.getElementById('cats').addEventListener('click', (ev) => {
    const token = localStorage.getItem('token');

    fetch('/api/cats', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(data => data.text())
      .then(data => {
        console.log(data);
      })
  });

  document.getElementById('foo').addEventListener('click', (ev) => {
    const token = localStorage.getItem('token');

    fetch('/api/foo', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(data => data.text())
      .then(data => {
        console.log(data);
      })
  });

  document.getElementById('profile').addEventListener('click', (ev) => {
    const token = localStorage.getItem('token');

    fetch('/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(data => data.text())
      .then(data => {
        console.log(data);
      })
  });
</script>

</body>
</html>`;

export default html;