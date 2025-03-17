const db = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const queries = require("../queries/unit_queries");
const model = require("../model/response_model");


const getAllunits =  async (req, res) => {
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



module.exports = {
    getAllunits,
};