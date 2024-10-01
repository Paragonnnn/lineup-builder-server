import express from "express";
import cors from 'cors'


const app = express();
const PORT = 5001;

app.use(cors());


async function getTeams(id) {
    try {
        const response = await fetch(`https://www.fotmob.com/api/lineup-builder/prefilled-team/${id}`)
        const data = await response.json()
        return data
    }
    catch (error) {
        console.log(error)
    }
    
}

async function searchTeamsAndPlayers(p) {
    try {
        const response = await fetch(`https://www.fotmob.com/api/search/suggest?hits=50&lang=en&term=${p}`)
        const data = await response.json()
        return data
    }
    catch (error) {
        console.log(error);
        
    }
}

app.get("/", (req, res) => {
    res.send("Hello World");

})

app.get('/team/', async (req,res) => {
    const { id } = req.query
    try {
        const team = await getTeams(id)
        if (id) {
            
            res.send(team)
            console.log(team);
            
        }
    }
    catch (error) {
        console.log(error)
    }
})

app.get('/search', async (req,res) => {
    const { p } = req.query
    try {
        const team = await searchTeamsAndPlayers(p)
        console.log('searching...');
        
        res.send(team)
    }
    catch (error) {
        console.log(error)
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})