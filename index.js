import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Lineup from "./model/lineup.js";
import { configDotenv } from "dotenv";

configDotenv()

const app = express();
const PORT = process.env.PORT || 3000;



const dbURI = process.env.DB_URI

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

app.get("/line-ups", async (req,res) => {
  const lineUps = await Lineup.find();
  res.json(lineUps);
})


app.get("/team/", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).send("Missing team ID");

  const team = await getTeams(id);
  res.send(team);
});

app.get("/search", async (req, res) => {
  const { p } = req.query;
  if (!p) return res.status(400).send("Missing search term");

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

app.delete('/delete-lineup/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLineup = await Lineup.findByIdAndDelete(id);
    if (!deletedLineup) return res.status(404).send("Lineup not found");
    
    res.send("Lineup deleted successfully");
  } catch (error) {
    console.error("Error deleting lineup:", error);
    res.status(500).send("Error deleting lineup");
  }
});