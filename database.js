const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DB_PATH = path.join(__dirname, "requests.db");

class Database {
    constructor() {
        this.db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error("Error opening database:", err);
            } else {
                console.log("Connected to SQLite database");
                this.initializeDatabase();
            }
        });
    }

    initializeDatabase() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    createRequest(name, email) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO requests (name, email) VALUES (?, ?)";
            this.db.run(query, [name, email], function(err) {
                if (err) return reject(err);
                resolve({
                    id: this.lastID,
                    name,
                    email,
                    status: "pending"
                });
            });
        });
    }

    getAllRequests() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM requests";
            this.db.all(query, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    getRequestsByEmail(email) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM requests WHERE email = ?";
            this.db.all(query, [email], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    updateRequestStatus(id, status) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE requests SET status = ? WHERE id = ?";
            this.db.run(query, [status, id], function(err) {
                if (err) return reject(err);
                if (this.changes === 0) {
                    return reject(new Error("Request not found"));
                }
                
                // Get the updated request
                const getQuery = "SELECT * FROM requests WHERE id = ?";
                this.db.get(getQuery, [id], (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                });
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

module.exports = new Database();
