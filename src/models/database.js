const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DB_PATH = path.join(__dirname, "../../data/requests.db");

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
                email TEXT NOT NULL UNIQUE,
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    async emailExists(email) {
        return new Promise((resolve, reject) => {
            const query = "SELECT COUNT(*) as count FROM requests WHERE email = ?";
            this.db.get(query, [email], (err, row) => {
                if (err) return reject(err);
                resolve(row.count > 0);
            });
        });
    }

    async createRequest(name, email) {
        try {
            const exists = await this.emailExists(email);
            if (exists) {
                throw new Error("Email already registered");
            }

            return new Promise((resolve, reject) => {
                const query = "INSERT INTO requests (name, email) VALUES (?, ?)";
                this.db.run(query, [name, email], (err, result) => {
                    if (err) return reject(err);
                    const id = result ? result.lastID : this.lastID;
                    resolve({
                        id,
                        name,
                        email,
                        status: "pending"
                    });
                });
            });
        } catch (err) {
            throw err;
        }
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
            const db = this.db;
            const query = "UPDATE requests SET status = ? WHERE id = ?";
            db.run(query, [status, id], function(err) {
                if (err) return reject(err);
                if (this.changes === 0) {
                    return reject(new Error("Request not found"));
                }
                
                db.get("SELECT * FROM requests WHERE id = ?", [id], (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                });
            });
        });
    }

    deleteRequest(id) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM requests WHERE id = ?";
            this.db.run(query, [id], function(err) {
                if (err) return reject(err);
                if (this.changes === 0) {
                    return reject(new Error("Request not found"));
                }
                resolve({ success: true, message: "Request deleted successfully" });
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
