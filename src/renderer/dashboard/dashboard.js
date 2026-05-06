function renderLabyrinths(labyrinths) {
  const list = document.getElementById('labyrinthList');
  list.innerHTML = '';

  if (!labyrinths || labyrinths.length === 0) {
    list.innerHTML = '<p>Aucun labyrinthe pour le moment.</p>';
    return;
  }

  labyrinths.forEach((lab) => {
    const item = document.createElement('div');
    item.className = 'labyrinth-item';
    item.innerHTML = `
      <div><strong>ID:</strong> ${lab.id}</div>
      <div><strong>Créé le :</strong> ${lab.created_at}</div>
      <button class="btn-small" data-id="${lab.id}">Supprimer</button>
    `;

    const button = item.querySelector('button');
    button.addEventListener('click', async () => {
      await window.api.deleteLabyrinth(lab.id);
      loadLabyrinths();
    });

    list.appendChild(item);
  });
}

async function loadLabyrinths() {
  const user = getStoredUser();
  if (!user) return;

  const labs = await window.api.getLabyrinths(user.id);
  renderLabyrinths(labs);
}

function getStoredUser() {
  const userData = localStorage.getItem('user');
  if (!userData) {
    window.location.href = '../login/login.html';
    return null;
  }

  return JSON.parse(userData);
}

function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  window.location.href = '../login/login.html';
}

async function createLabyrinth() {
  const user = getStoredUser();
  if (!user) return;

  const name = prompt('Nom du labyrinthe à créer ?');
  if (!name) return;

  const data = { name, createdBy: user.username };
  const res = await window.api.createLabyrinth(user.id, data);
  if (res.success) {
    loadLabyrinths();
  } else {
    alert('Impossible de créer le labyrinthe.');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const user = getStoredUser();
  if (!user) return;

  document.getElementById('userInfo').innerHTML = `
    <p>Connecté en tant que <strong>${user.username}</strong></p>
    <p>ID utilisateur : ${user.id}</p>
  `;

  loadLabyrinths();
});
