const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Task 8 & 9: Authentication Middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    // Mengecek apakah user sudah login dengan melihat data session
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verifikasi JWT Token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // <--- KRUSIAL: Memberi izin untuk lanjut ke rute Task 9/10
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on port " + PORT));
