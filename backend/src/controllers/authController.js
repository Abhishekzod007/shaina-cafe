import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";
//import { verifyTurnstile } from "../utils/verifyTurnstile.js";
import fetch from "node-fetch";

export const loginWithOTP = async (req , res) => {
    // logic here 
    try {
       const { phone } = req.body;
       if(!phone) return res.status(400).json({ msg: "Phone is required"});

       const normalised= phone.toString().trim();

       let user = await User.findOne({ phone: normalised });
       if(!user){
        user = await User.create({ phone: normalised, role: "user", name: "Guest"});
       }

       const token = generateToken({ id: user._id, role: user.role });

       return res.json({ user: { id: user._id, name: user.name, phone: user.phone, role: user.role },
                        token})

    }
    catch(err){
        console.error("OTP login errr:", err);
        return res.status(500).json({ msg: "Server error"});
    }
}
export const loginWithEmail = async (req , res) => {
    // logic here 
    try {
        const {email , password, captchaToken} = req.body;
        if (!captchaToken) {
      return res.status(400).json({ message: "Captcha missing" });
    }

    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.CLOUDFLARE_TURNSTILE_SECRET,
          response: captchaToken,
        }),
      }
    );

    const captchaData = await verifyRes.json();

    if (!captchaData.success) {
      return res.status(403).json({ message: "Captcha verification failed" });
    }
        if(!email) return res.status(400).json({ msg: "Email is required"});

        const normalisedEmail = email.toString().trim().toLowerCase();

        if(process.env.ADMIN_EMAIL && normalisedEmail === process.env.ADMIN_EMAIL){
            if(!password || password !==process.env.ADMIN_PASSWORD){
                return res.status(401).json({ msg: "Invalid admin credentials"})
            }

            let admin = await User.findOne({ email: normalisedEmail});
            if(!admin){
                admin = await User.create({ email: normalisedEmail, role: "admin", name: "Admin"});
            }

            const token  = generateToken({ id: admin._id, role: "admin"});
            return res.json({user: {id: admin._id, email: admin.email, role: admin.role}, token});
        }

        let user = await User.findOne({ email: normalisedEmail });
        if(!user){
            return res.status(404).json({ msg: "User not found. Please register first." });

        } else {

            if(user.password && password){
                const ok = await bcrypt.compare(password, user.password);
                if(!ok) return res.status(401).json({ msg: "Invalid credentials"});
            }
        }

        const token = generateToken({ id: user._id, role: user.role });
        return res.json({ user: { id: user._id, email: user.email, role: user.role , name: user.name,  phone: user.phone}, token });
    } 
    catch (err) {
        console.error("Email login error:", err);
        return res.status(500).json({ msg: "Server error"});
    }
}

export const getProfile = async (req , res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ msg: "Unauthorised" });

    const user = await User.findById(userId)
      .select("-password -__v");  // ✅ FIXED (double underscore, no mix)

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.json({ user });

  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

export const registerUser = async (req , res) => {
  
  try {
    const { name, email, phone, password, captchaToken } = req.body;

     if (!captchaToken) {
      return res.status(400).json({ msg: "Captcha missing" });
    }

    // 🔐 VERIFY CAPTCHA (INLINE – SAME AS LOGIN)
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.CLOUDFLARE_TURNSTILE_SECRET,
          response: captchaToken,
        }),
      }
    );

    const captchaData = await verifyRes.json();

    if (!captchaData.success) {
      return res.status(403).json({ msg: "Captcha verification failed" });
    }
    if (!name || !email || !phone || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const normalisedEmail = email.trim().toLowerCase();

    // Check if user exists
    let existing = await User.findOne({ email: normalisedEmail });
    if (existing) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalisedEmail,
      phone,
      password: hashed,
      role: "user",
    });

    const token = generateToken({ id: user._id, role: "user" });

    return res.json({
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      token,
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone},
      { new: true }
    ).select("-password -__v");

    res.json({ user, msg: "Profile updated" });
  } catch (err) {
    console.log("Profile update error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
