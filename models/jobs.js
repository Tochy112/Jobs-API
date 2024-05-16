const mongoose = require("mongoose")

const JobsSchema = mongoose.Schema({
    company: {
        type: String,
        required: [true, "Please provide company name"],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, "Please provide position"],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ["interview", "declined", "pending"],
        default: "pending",
    },
    //we assign a user to a job, referencing the user table. 
    // you can take this as a secondary key stuff
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user"]
    }
},
{timestamps: true}
)

module.exports = mongoose.model("Job", JobsSchema)