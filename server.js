const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB Connection (Localhost)
mongoose.connect('mongodb://127.0.0.1:27017/sih2026DB')
.then(() => console.log('MongoDB Connected Successfully for SIH 2026!'))
.catch((err) => console.log('Database Connection Error: ', err));

// Mongoose Schema for Team Registration
const teamSchema = new mongoose.Schema({
    // Team Leader
    leaderName: String,
    leaderBranch: String,
    leaderYear: String,
    leaderEmail: { type: String, unique: true },
    teamName: { type: String, unique: true },
    leaderContact: String,
    leaderGender: String,

    // Member 1
    member1Name: String,
    member1Branch: String,
    member1Year: String,
    member1Email: String,
    member1Contact: String,
    member1Gender: String,

    // Member 2
    member2Name: String,
    member2Branch: String,
    member2Year: String,
    member2Email: String,
    member2Contact: String,
    member2Gender: String,

    // Member 3
    member3Name: String,
    member3Branch: String,
    member3Year: String,
    member3Email: String,
    member3Contact: String,
    member3Gender: String,

    // Member 4
    member4Name: String,
    member4Branch: String,
    member4Year: String,
    member4Email: String,
    member4Contact: String,
    member4Gender: String,

    // Member 5
    member5Name: String,
    member5Branch: String,
    member5Year: String,
    member5Email: String,
    member5Contact: String,
    member5Gender: String,

    registeredAt: { type: Date, default: Date.now }
});

const Team = mongoose.model('Team', teamSchema);

// Register API Route
app.post('/api/register', async (req, res) => {
    try {
        const formData = req.body;

        // Check if Team Name or Leader Email already exists
        const existingTeam = await Team.findOne({ 
            $or: [{ teamName: formData.teamName }, { leaderEmail: formData.leaderEmail }] 
        });

        if (existingTeam) {
            return res.status(400).json({ success: false, message: 'Team Name or Leader Email already registered!' });
        }

        // Save new team data
        const newTeam = new Team(formData);
        await newTeam.save();

        res.status(201).json({ success: true, message: 'Team registered successfully in MongoDB!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



module.exports = app;