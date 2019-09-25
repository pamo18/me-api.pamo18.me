/*eslint max-len: ["error", { "code": 200 }]*/
var express = require('express');
var router = express.Router();
const error = require("../../models/error.js");
const db = require("../../db/database.js");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs');
const bcrypt = require('bcryptjs');

dotenv.config();

router.post("/", (req, res) => {
    let sql = "SELECT * FROM users WHERE name = ?";
    let params = [req.body.name];

    db.get(sql, params, function (err, row) {
        if (err) {
            return error.database(res, "/login", err);
        }

        if (row) {
            let password = req.body.password;
            let hash = row.password;

            bcrypt.compare(password, hash, function(err, match) {
                if (match) {
                    const randomKey1 = Math.random().toString(36).slice(-8);
                    const randomKey2 = Math.random().toString(36).slice(-8);
                    const randomKey3 = Math.random().toString(36).slice(-8);
                    const randomKey4 = Math.random().toString(36).slice(-8);
                    const newKey = "JWT_SECRET=" + randomKey1 + randomKey2 + randomKey3 + randomKey4 + randomKey2 + randomKey3 + randomKey1 + randomKey2 + randomKey3 + randomKey4 + randomKey2;

                    fs.writeFile("./.env", newKey, (err) => {
                        if (err) {
                            return error.hash(res, "/login", err);
                        }
                        console.log("Successfully Written to File.");
                    });
                    const payload = { email: row.email };
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret, { expiresIn: '1h'});

                    res.json({
                        data: {
                            result: true,
                            user: row,
                            token: token
                        }
                    });
                } else {
                    res.json({
                        data: {
                            result: false,
                            user: "Password is incorrect!",
                            token: null
                        }
                    });
                }
            });
        } else {
            res.json({
                data: {
                    result: false,
                    user: "Username is incorrect!"
                }
            });
        }
    });
});

module.exports = router;
