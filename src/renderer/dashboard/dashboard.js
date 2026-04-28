// Variables globales pour le labyrinthe
let currentMaze = null;
const canvas = document.getElementById('mazeCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

window.onload = async () => {
    // 🔐 1. Récupération de la session
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // Si pas de session, retour au login
    if (!user || !token) {
        window.location.href = "../login/login.html";
        return;
    }

    // 👤 2. Affichage des infos user
    const userInfo = document.getElementById("userInfo");
    if (userInfo) {
        userInfo.innerHTML = `
            <h3>👤 ${user.username}</h3>
            <p>Role: <span class="badge">${user.role || "user"}</span></p>
        `;
    }

    // 🧩 3. Charger la liste des labyrinthes
    loadLabyrinths();
};

// =====================
// 🧩 CHARGEMENT & LISTE
// =====================
async function loadLabyrinths() {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await window.api.getLabyrinths(user.id);
    const container = document.getElementById("labyrinthList");

    if (!container) return;

    if (!res || res.length === 0) {
        container.innerHTML = "<p class='empty'>Aucun labyrinthe enregistré.</p>";
        return;
    }

    container.innerHTML = "";
    res.forEach(lab => {
        const div = document.createElement("div");
        div.className = "lab-item";
        div.innerHTML = `
            <span>🧩 # ${lab.id} (Diff: ${lab.difficulty || '?'})</span>
            <div class="actions">
                <button class="btn-view" onclick="viewMaze(${lab.id})">👁️</button>
                <button class="btn-delete" onclick="deleteLab(${lab.id})">❌</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// =====================
// 🎨 DESSIN DU LABYRINTHE
// =====================
function drawMaze(mazeData) {
    if (!ctx) return;
    
    const grid = typeof mazeData === 'string' ? JSON.parse(mazeData) : mazeData;
    const size = grid.length;
    const cellSize = Math.floor(500 / size); // Adapte la taille au canvas de 500px

    canvas.width = size * cellSize;
    canvas.height = size * cellSize;

    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            // 1 = Mur (Bleu foncé), 0 = Chemin (Blanc/Bleu clair)
            ctx.fillStyle = cell === 1 ? "#1e293b" : "#f8fafc";
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        });
    });
    
    document.getElementById('solveBtn').disabled = false;
}

// =====================
// ➕ GÉNÉRATION (À compléter avec l'algo)
// =====================
async function generateAndSave() {
    const user = JSON.parse(localStorage.getItem("user"));
    const sizeInput = document.getElementById('mazeSize')?.value || 15;
    const difficulty = document.getElementById('mazeDiff')?.value || 5;

    // Simulation d'une grille pour l'instant (on ajoutera le vrai algo après)
    const size = parseInt(sizeInput);
    const dummyGrid = Array(size).fill().map(() => Array(size).fill(0));

    const res = await window.api.createLabyrinth(user.id, {
        grid: dummyGrid,
        size: size,
        difficulty: difficulty
    });

    if(res) {
        drawMaze(dummyGrid);
        loadLabyrinths();
    }
}

// =====================
// ❌ ACTIONS
// =====================
async function deleteLab(id) {
    if(confirm("Supprimer ce labyrinthe ?")) {
        await window.api.deleteLabyrinth(id);
        loadLabyrinths();
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "../login/login.html";
}