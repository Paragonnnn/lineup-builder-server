import mongoose from "mongoose";
const Schema = mongoose.Schema


const lineupSchema = new Schema({
    team: {
        type: String,
        required: true,
    },
    players: {
        type: Array,
        required: true,
    },
    formation: {
        type: String,
        required: true,
    },
    positions: {
        type: Object,
        required: true,
    },
    
},{timestamps: true})


const Lineup = mongoose.model('Lineup', lineupSchema)

export default Lineup