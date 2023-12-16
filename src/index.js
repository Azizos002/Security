//Dépendances
const express = require("express");//Le framework web utilisé pour construire l'application.
const path = require("path");//Module Node.js pour manipuler les chemins de fichiers.
const collection = require("./config");//Module pour une connexion à une collection MongoDB
const bcrypt = require('bcrypt');//Bibliothèque pour le hachage sécurisé des mots de passe.

// Configuration de l'application Express
const app = express();//une instance de l'application Express.
app.use(express.json());//Middleware pour traiter les données JSON.
app.use(express.static("public"));//Middleware pour servir des fichiers statiques à partir du répertoire "public"


app.use(express.urlencoded({ extended: false }));//Middleware pour traiter les données URL encodées.
app.set("view engine", "ejs");//Configure EJS comme moteur de vue pour rendre les templates.

//Définition des Routes
app.get("/", (req, res) => {//Renvoie la page de connexion.
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");//Renvoie la page d'inscription.
});




app.get("/login", (req, res) => {
    // Check if the signupSuccess query parameter is present
    if (req.query.signupSuccess === 'true') {
        res.render('login', { signupSuccess: true });
    } else {
        res.render('login');
    }
});

//Enregistrement de l'utilisateur
app.post("/signup", async (req, res) => {
    try {
        const data = {
            name: req.body.username,
            email: req.body.email,
            password: req.body.password
        };

        console.log('Data before insertion:', data);

        // Verification if the user already exists
        const existingUser = await collection.findOne({ name: data.name });

        if (existingUser) {
            res.send('User already exists. Please choose a different username.');
        } else {
            const saltRounds = 10; // Number of rounds for bcrypt
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);
            const hashedEmail = await bcrypt.hash(data.email, saltRounds);

            data.password = hashedPassword;
            data.email = hashedEmail;

            // Insert the user data into the database
            await collection.insertMany(data);

            console.log('data after crypt',data);



            // Redirect to the login page with a success query parameter
            res.redirect("/login");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error during signup");
    }
});

/////////////////////////////////////////////////////////////////////////////////////
//Connexion de l'utilisateur
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot found")
        }
        // comparaison entre le mot de passe donné par l'utilisateur et le hachée dans la base de données
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            res.render("home");
        }
    }
    catch {
        res.send("wrong Details");
    }
});


// Configuration du Serveur
const port = 5000;//Configure le serveur pour écouter sur le port 5000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});