function renderLabyrinths(labyrinths) {
    const list = document.getElementById('labyrinthList');
    if (!list) return;

    list.innerHTML = '';

    if (!labyrinths || labyrinths.length === 0) {
        list.innerHTML = '<p>Aucun labyrinthe pour le moment.</p>';
        return;
    }

    labyrinths.forEach((lab) => {
        const item = document.createElement('div');
        item.className = 'labyrinth-item';
        item.innerHTML = `
            <div class="lab-info">
                <strong>ID:</strong> ${lab.id} | 
                <strong>Créé le :</strong> ${new Date(lab.created_at).toLocaleDateString()}
            </div>
            <div class="lab-actions">
                <button class="btn-small btn-delete" data-id="${lab.id}">Supprimer</button>
            </div>
        `;

        const deleteBtn = item.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', async () => {
            if (confirm("Voulez-vous vraiment supprimer ce labyrinthe ?")) {
                await window.api.deleteLabyrinth(lab.id);
                loadLabyrinths();
            }
        });

        list.appendChild(item);
    });
}

async function loadLabyrinths() {
    const user = getStoredUser();
    if (!user) return;

    try {
        const labs = await window.api.getLabyrinths(user.id);
        renderLabyrinths(labs);
    } catch (error) {
        console.error(error);
    }
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

    const name = prompt('Nom du labyrinthe ?', 'Mon Labyrinthe');
    if (!name) return;

    const data = { 
        name: name, 
        createdBy: user.username,
        layout: "{}"
    };

    try {
        const res = await window.api.createLabyrinth(user.id, data);
        if (res.success) {
            loadLabyrinths();
        } else {
            alert('Erreur : ' + res.error);
        }
    } catch (error) {
        console.error(error);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const user = getStoredUser();
    if (!user) return;

    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        userInfo.innerHTML = `
            <p>Connecté en tant que <strong>${user.username}</strong></p>
            <p>ID utilisateur : ${user.id}</p>
        `;
    }

    const btnCreate = document.getElementById('btnCreate');
    if (btnCreate) {
        btnCreate.addEventListener('click', createLabyrinth);
    }

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', logout);
    }

    loadLabyrinths();
});