const { register, login } = require('./src/backend/auth');

async function test() {
  try {
    console.log("---- REGISTER ----");
    const reg = await register("testuser", "1234");
    console.log(reg);

    console.log("---- LOGIN ----");
    const log = await login("testuser1", "1234");
    console.log(log);

  } catch (err) {
    console.error(err.message);
  }
}

test();