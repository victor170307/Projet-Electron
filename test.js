const { register } = require('./auth');

async function test() {
  try {
    const userId = await register("testuser", "1234");
    console.log("Utilisateur créé avec ID :", userId);
  } catch (err) {
    console.error(err.message);
  }
}

test();