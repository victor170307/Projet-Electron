console.log("Script login.js chargé !"); // Pour vérifier si le fichier est lu

async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const resultElement = document.getElementById('result');

    console.log("Tentative de connexion pour:", username);

    if (!username || !password) {
        resultElement.innerText = "⚠️ Veuillez remplir tous les champs.";
        return;
    }

    try {
        const res = await window.api.login({ username, password });
        console.log("Réponse reçue du backend:", res);

        if (res.success) {
            resultElement.style.color = "green";
            resultElement.innerText = "✅ Connexion réussie !";
            
            // Stockage des infos
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);
            
            // Redirection
            setTimeout(() => {
                window.location.href = "../dashboard/dashboard.html";
            }, 1000);
        } else {
            resultElement.style.color = "red";
            resultElement.innerText = "❌ " + res.error;
        }
    } catch (err) {
        console.error("Erreur d'appel API:", err);
        resultElement.innerText = "❌ Erreur de communication avec le serveur.";
    }
}

async function handleRegister() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const resultElement = document.getElementById('result');

    console.log("Tentative d'inscription pour:", username);

    if (!username || !password) {
        resultElement.style.color = "red";
        resultElement.innerText = "⚠️ Remplissez les champs pour vous inscrire.";
        return;
    }

    try {
        const res = await window.api.register({ username, password });
        console.log("Réponse inscription :", res);

        if (res.success) {
            resultElement.style.color = "green";
            resultElement.innerText = "✅ Compte créé avec succès ! Redirection...";

            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);

            setTimeout(() => {
                window.location.href = "../dashboard/dashboard.html";
            }, 800);
        } else {
            resultElement.style.color = "red";
            resultElement.innerText = "❌ " + res.error;
        }
    } catch (err) {
        console.error("Erreur d'appel API inscription:", err);
        resultElement.style.color = "red";
        resultElement.innerText = "❌ Erreur de communication avec le serveur.";
    }
}