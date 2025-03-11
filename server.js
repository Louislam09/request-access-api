const express = require("express");
const db = require("./database");

const app = express();
const PORT = 5000;

app.use(express.json());

app.post("/request-access", async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: "Name and Email are required" });
    }

    try {
        const newRequest = await db.createRequest(name, email);
        res.status(201).json({ message: "Request submitted successfully", request: newRequest });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating request" });
    }
});

app.get("/requests", async (req, res) => {
    try {
        const requests = await db.getAllRequests();
        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching requests" });
    }
});

app.get("/check-status", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const requests = await db.getRequestsByEmail(email);
        if (requests.length === 0) {
            return res.status(404).json({ message: "No requests found for this email" });
        }
        res.json({ requests });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error checking status" });
    }
});

app.put("/requests/:id", async (req, res) => {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        const updatedRequest = await db.updateRequestStatus(req.params.id, status);
        res.json({ message: `Request ${status}`, request: updatedRequest });
    } catch (err) {
        if (err.message === "Request not found") {
            return res.status(404).json({ message: "Request not found" });
        }
        console.error(err);
        res.status(500).json({ message: "Error updating request" });
    }
});

// Graceful shutdown
process.on("SIGINT", async () => {
    try {
        await db.close();
        console.log("Database connection closed");
        process.exit(0);
    } catch (err) {
        console.error("Error closing database:", err);
        process.exit(1);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
