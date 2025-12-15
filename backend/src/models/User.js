import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        trim: true
    },

    email:{ 
        type:String,
        unique: true,
        sparse: true,
        trim: true
    },

    phone:{
        type: String,
        unique: true,
        sparse: true
    },

    password:{
        type: String,
        required: false
    },
    role: {
        type:String,
        enum: ["user","admin"], // it restricts someone to take value from these two only 
        default: "user"
    }
},
{
    timestamps: true
});

export default mongoose.model("User", userSchema);