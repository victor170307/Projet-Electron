const { createUser, getUser } = require('./database');      
async function register(username, password) {
  const existing = await getUser(username);

  if (existing) {
    throw new Error("Utilisateur déjà existant");
  }

  const userId = await createUser(username, password);
  return userId;
}

module.exports = { register };