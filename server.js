const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();
const port = 3000;

app.use(bodyParser.json());

//pour recuperer les messgae
app.get("/messages", (req, res) => {
  const sql = "SELECT * FROM message ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des messages" });
    } else {
      res.status(200).json(results);
    }
  });
});

//pour recupere les message entre 2 person
app.post("/messages", (req, res) => {
  const { id, sender, message } = req.body;

  if (!message || !sender) {
    return res
      .status(400)
      .json({ error: "Le contenu et l'expéditeur sont requis" });
  }

  const sql = "INSERT INTO messages (id,sender, message) VALUES (?, ?,?)";
  db.query(sql, [id, sender, message], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Erreur lors de l'ajout du message" });
    } else {
      res
        .status(201)
        .json({ message: "Message ajouté avec succès", id: result.insertId });
    }
  });
});


app.get("/user/:username", (req, res) => {
  const username = req.params.username;
  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [username], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération de l'utilisateur" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    } else {
      res.status(200).json(results[0]);
    }
  });
});
app.get("/users", (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, results) => {
      if (err) {
        res
          .status(500)
          .json({ error: "Erreur lors de la récupération des messages" });
      } else {
        console.log(results);
        res.status(200).json(results);
      }
    });
  });
  

app.post("/user", (req, res) => {
  const { username, password } = req.body;
  const checkSql = "SELECT * FROM users WHERE username = ?";

  db.query(checkSql, [username], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la vérification de l'utilisateur" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "L'utilisateur existe déjà" });
    }

    // Ajouter l'utilisateur
    const insertSql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(insertSql, [username, password], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Erreur lors de l'ajout de l'utilisateur" });
      }
      res
        .status(201)
        .json({
          message: "Utilisateur ajouté avec succès",
          id: result.insertId,
        });
    });
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
