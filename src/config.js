const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/Login-tut");

//Vérifier si la base de données est connectée ou non
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})

//Définition d'un schéma pour un modèle MongoDB
const Loginschema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Partie de la collection
const collection = new mongoose.model("users", Loginschema);
// Exporte la collection pour pouvoir l'utiliser dans d'autres fichiers
module.exports = collection;