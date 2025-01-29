import pool from '../database/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const Signup = async(req,res)=>{
  try{
    const {first_name,last_name,email,password}=req.body;
    if(!first_name||!last_name||!email||!password){
      return res.status(400).json("either first name,last name,email or password is missing");
    }
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if(user.rows.length>0){
      return res.status(400).json("user already exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, first_name, last_name, email`;
    const insertedUser = await pool.query(query, [first_name, last_name, email, hashedPassword])
    return res.status(201).json({
      message: "User registered successfully",
      user: insertedUser.rows[0],
    });
    }catch(error){
    console.error("[ERROR][registration.controller.js][Signup]:",error)
    throw error;
  }
}


export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("Email and password are required");
    }

    const userQuery = "SELECT id,first_name,last_name,email,password FROM users WHERE email = $1";
    const userResult = await pool.query(userQuery, [email]);
    if (userResult.rows.length<0) {
      return res.status(401).json("user not found");
    }

    const user = userResult.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json("Invalid email or password");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "your_secret_key",
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error("[ERROR][login.controller.js][Login]:", error);
  }
};

