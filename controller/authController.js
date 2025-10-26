import {query} from "../db/db.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

export const signup = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    if (!name || !email || !role || !password) {
      res.status(400).json({ msg: "all fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

    await query(
      "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4)",
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    res.status(500).json({
      msg: "Error in registering user",
      err: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, role, password } = req.body;

    if (!email || !role || !password) {
      res.status(400).json({ msg: "all fields are required" });
    }

    const result = await query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ msg: "No user found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Credentials not matched" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      userDetails: {
        id: user.id,
        email: user.email,
        name: user.name, 
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error in registering user",
      err: error.message,
    });
  }
};
