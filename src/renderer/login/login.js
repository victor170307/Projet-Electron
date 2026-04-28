async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await window.api.login({ username, password });

  document.getElementById('result').innerText =
    res.success ? "✅ Connecté !" : "❌ " + res.error;
}

async function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await window.api.register({ username, password });
  document.getElementById('result').innerText =
    res.success ? "✅ Compte créé !" : "❌ " + res.error;
}

  