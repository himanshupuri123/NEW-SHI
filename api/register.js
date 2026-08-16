const mongoose = require("mongoose");

// MongoDB connection cache
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}

// Connect to MongoDB
async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI environment variable is not configured");
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 10000
            })
            .then((mongooseInstance) => {
                console.log("MongoDB Connected Successfully");
                return mongooseInstance;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}


// Team Registration Schema
const teamSchema = new mongoose.Schema(
    {
        // Team Leader
        leaderName: {
            type: String,
            required: true,
            trim: true
        },

        leaderBranch: {
            type: String,
            trim: true
        },

        leaderYear: {
            type: String,
            trim: true
        },

        leaderEmail: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        teamName: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        leaderContact: {
            type: String,
            trim: true
        },

        leaderGender: {
            type: String,
            trim: true
        },


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


        registeredAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: "teamregistrations"
    }
);


// Avoid model recompilation on Vercel
const Team =
    mongoose.models.Team ||
    mongoose.model("Team", teamSchema);


// API Handler
module.exports = async (req, res) => {

    // Allow only POST
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    try {

        // Connect MongoDB
        await connectDB();

        const formData = req.body || {};

        // Basic validation
        if (!formData.teamName || !formData.leaderEmail) {
            return res.status(400).json({
                success: false,
                message: "Team Name and Leader Email are required."
            });
        }


        // Check existing Team Name
        const existingTeam = await Team.findOne({
            teamName: formData.teamName
        });

        if (existingTeam) {
            return res.status(400).json({
                success: false,
                message: "This Team Name is already registered."
            });
        }


        // Check existing Leader Email
        const existingLeader = await Team.findOne({
            leaderEmail: formData.leaderEmail.toLowerCase()
        });

        if (existingLeader) {
            return res.status(400).json({
                success: false,
                message: "This Leader Email is already registered."
            });
        }


        // Create team
        const newTeam = new Team({
            ...formData,
            leaderEmail: formData.leaderEmail.toLowerCase().trim(),
            teamName: formData.teamName.trim()
        });


        // Save to MongoDB
        await newTeam.save();


        return res.status(201).json({
            success: true,
            message: "Team registered successfully!"
        });


    } catch (error) {

        console.error("Registration Error:", error);

        // Duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Team Name or Leader Email already exists."
            });
        }


        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};