import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Lineup from "./model/lineup.js";

const app = express();
const PORT = 5001;


const dbURI = "mongodb+srv://oluwaseyi:oluwaseyi2002@lineup-builder-db.dtl5h.mongodb.net/lineup-builder?retryWrites=true&w=majority&appName=lineup-builder-db";

mongoose.connect(dbURI)
  .then(() => {
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.error("Database connection error:", err));

app.use(cors());
app.use(express.json());

async function getTeams(id) {
  try {
    const response = await fetch(`https://www.fotmob.com/api/lineup-builder/prefilled-team/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
}

async function searchTeamsAndPlayers(term) {
  try {
    const response = await fetch(`https://www.fotmob.com/api/search/suggest?hits=50&lang=en&term=${term}`);
    return await response.json();
  } catch (error) {
    console.error("Error searching teams and players:", error);
  }
}

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/add-lineup", async (req, res) => {
  const lineup = new Lineup({
    team: 'Liverpool',
    players: ['Salah', 'Mane', 'Firmino'],
    formation: '4-3-3',
    positions: {
      'Salah': 'RW',
      'Mane': 'LW',
      'Firmino': 'CF'
    }
  });

  try {
    const result = await lineup.save();
    res.send(result);
  } catch (err) {
    console.error("Error saving lineup:", err);
    res.status(500).send("Error saving lineup");
  }
});

app.get("/team/", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).send("Missing team ID");

  const team = await getTeams(id);
  res.send(team);
});

app.get("/search", async (req, res) => {
  const { p } = req.query;
  if (!p) return res.status(400).send("Missing search term");

  console.log("Searching for:", p);
  const results = await searchTeamsAndPlayers(p);
  res.send(results);
});

app.post('/save-lineup', async (req, res) => {
  const lineup = new Lineup(req.body);
  
  try {
    const result = await lineup.save();
    res.send(result);
  } catch (err) {
    console.error("Error saving lineup:", err);
    res.status(500).send("Error saving lineup");
  }
});

app.get('/get-lineup/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const lineup = await Lineup.findById(id);
    if (!lineup) return res.status(404).send("Lineup not found");
    res.send(lineup);
  } catch (error) {
    console.error("Error fetching lineup:", error);
    res.status(500).send("Error fetching lineup");
  }
});
