const db = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const queries = require("../queries/user_queries");
const model = require("../model/response_model");


const registerUser =  async (req, res) => {
    const { name,email,password } = req.body;
    if (!name || !email || !password) {
        const response = new model.responseModel(400, false, [], "All fields are required");
        return res.send(response);
    }
    // Check if email already exists   
    db.query( queries. checkUserQuery, [email], async (err, results) => {
        if (err){
            const response = new model.responseModel(500, false, [], err.message);
            return res.send(response);
        } 
        if (results.length > 0) {
            const response = new model.responseModel(400, false, [], "Email already registered");
            return res.send(response);
        }
        // Hash password and insert new user
        const hashedPassword = await bcrypt.hash(password, 10);   
        db.query(queries.insertUser, [name, email, hashedPassword], (err, result) => {
            if (err) if (err){
                const response = new model.responseModel(500, false, [], err.message);
                return res.send(response);
            } 
            const response = new model.responseModel(201, true, [], "User registered successfully");
            return res.send(response);               
        });
    });
};

const loginUser =  async (req, res) => {
    const { email, password } = req.body;
    
        if (!email || !password) {
            return res.send(new model.responseModel(400, false, [],"Email and password are required" ));
        }       
        db.query(queries.loginUser, [email], async (err, results) => {
            if (err || results.length === 0)  return res.send(new model.responseModel(401, false, [], "Invalid credentials"));              
            const validPassword = await bcrypt.compare(password, results[0].password);
            if (!validPassword) return res.send(new model.responseModel(401, false, [], "Invalid credentials"));        
            const token = jwt.sign({ userId: results[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.send(new model.responseModel(200, false, [ {"bearer":token}], "Login successful"));             
        });
};

const logoutUser =  async (req, res) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    db.query(queries.logoutUser, [token], (err, result) => {
        if (err) return res.send(new model.responseModel(500, false, [], err.message));   
        return res.send(new model.responseModel(200, true, [],  "Logout successful. Token has been blacklisted."));     
    });
};


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};