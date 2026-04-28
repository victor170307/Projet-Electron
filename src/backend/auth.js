const bcrypt = require('bcryptjs');
const { createUser, getUser } = require('./database');
const { generateToken } = require('./utils/jwt');

async function register(username, password) {
  const existing = await getUser(username);

  if (existing) {
    throw new Error("Utilisateur déjà existant");
  }

  const hashedPassword = await bcrypt.hash(password, 10); //hash du mot de passe

  const userId = await createUser(username, hashedPassword);

  const token = generateToken({ id: userId, username });

  return {
  user: {
    id: user.id,
    username: user.username
  },
  token
};
}

async function login(username, password) {
  const user = await getUser(username);

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error("Mot de passe incorrect");
  }

  const token = generateToken(user);

  return { user, token };
}

module.exports = { register, login };