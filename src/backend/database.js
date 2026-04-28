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

  // Table utilisateurs
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  // Table labyrinthes
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
// FONCTIONS UTILES
// ====================

// ➤ Ajouter un utilisateur
function createUser(username, password) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password],
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

module.exports = {
  db,
  createUser,
  getUser,
  createLabyrinth,
  getLabyrinths
};