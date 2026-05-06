const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.all("SELECT username FROM users", [], (err, rows) => {
  if (err) {
    console.error("Erreur :", err.message);
    return;
  }
  console.log("Liste des utilisateurs inscrits :");
  rows.forEach((row) => {
    console.log("- " + row.username);
  });
});

db.close();