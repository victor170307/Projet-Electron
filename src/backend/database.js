const sqlite3 = require('sqlite3').verbose();

// Connexion à la base
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error("Erreur connexion DB :", err.message);
  } else {
    console.log("Connecté à SQLite ✅");
  }
});

// Création des tables
db.serialize(() => {

  // 👤 Table utilisateurs (avec rôle)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user'
    )
  `);

  // 🧩 Table labyrinthes
  db.run(`
    CREATE TABLE IF NOT EXISTS labyrinths (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

});


// ====================
// 👤 USERS
// ====================

// ➤ Ajouter un utilisateur
function createUser(username, password, role = "user") {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, password, role],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

// ➤ Trouver un utilisateur
function getUser(username) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

// ➤ Trouver un utilisateur par ID
function getUserById(id) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, username, role FROM users WHERE id = ?",
      [id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

// ➤ Récupérer tous les utilisateurs (ADMIN)
function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT id, username, role FROM users",
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

// ➤ Supprimer un utilisateur
function deleteUser(id) {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM users WHERE id = ?",
      [id],
      function (err) {
        if (err) reject(err);
        else resolve(true);
      }
    );
  });
}


// ====================
// 🧩 LABYRINTHES
// ====================

// ➤ Ajouter un labyrinthe
function createLabyrinth(user_id, data) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO labyrinths (user_id, data) VALUES (?, ?)",
      [user_id, JSON.stringify(data)],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

// ➤ Récupérer les labyrinthes d’un utilisateur
function getLabyrinths(user_id) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM labyrinths WHERE user_id = ?",
      [user_id],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

// ➤ Récupérer tous les labyrinthes (ADMIN)
function getAllLabyrinths() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM labyrinths",
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

// ➤ Supprimer un labyrinthe
function deleteLabyrinth(id) {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM labyrinths WHERE id = ?",
      [id],
      function (err) {
        if (err) reject(err);
        else resolve(true);
      }
    );
  });
}


// ====================
// 📊 STATS (ADMIN)
// ====================

// ➤ Nombre total d’utilisateurs
function countUsers() {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
      if (err) reject(err);
      else resolve(row.count);
    });
  });
}

// ➤ Nombre total de labyrinthes
function countLabyrinths() {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM labyrinths", [], (err, row) => {
      if (err) reject(err);
      else resolve(row.count);
    });
  });
}


// ====================
// EXPORTS
// ====================

module.exports = {
  db,

  // users
  createUser,
  getUser,
  getUserById,
  getAllUsers,
  deleteUser,

  // labyrinths
  createLabyrinth,
  getLabyrinths,
  getAllLabyrinths,
  deleteLabyrinth,

  // stats
  countUsers,
  countLabyrinths
};