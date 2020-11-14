const template = document.createElement('template');
template.innerHTML = `
<style>
label {
    display: block;
  }
</style>
<h2>🔓 NOT LOGGED IN</h2>
<form id="form">
  <label>user name:
    <input type="text" name="username" id="username" value="john" />
  </label>
  <label>password:
    <input type="password" name="password" id="password" value="test"/>
  </label>
  <input type="submit" value="Log in" />
</form>
<button id="logout">Log out</button>`;

const createPostLogin = (h2, username, password) => (ev) => {
  ev.preventDefault();
  // Token is in cookie, payload is {"id":1,"name":"john"}
  fetch('/auth/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((data) => data.json())
    .then((data) => {
      h2.innerHTML = `🔒 LOGGED IN AS ${data.name}`;
    });
};

const createGetLogout = (h2) => (ev) => {
  fetch(`/auth/logout`, {
    method: 'GET',
  })
    .then((data) => data.text())
    .then((data) => {
      h2.innerHTML = `🔓 LOGGED IN AS ${data.name}`;
    });
};

class LoginForm extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const node = template.content.cloneNode(true);
    const h2 = node.querySelector('h2');
    const username = node.getElementById('username').value;
    const password = node.getElementById('password').value;

    node
      .getElementById('form')
      .addEventListener('submit', createPostLogin(h2, username, password));
    node.querySelector('button').addEventListener('click', createGetLogout(h2));

    shadowRoot.appendChild(node);
  }
}

customElements.define('login-form', LoginForm);

export default LoginForm;
