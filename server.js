const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, "requests.json");

app.use(express.json());

// Load requests from file
const loadRequests = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
};

// Save requests to file
const saveRequests = (requests) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(requests, null, 2));
};

// 📌 Submit a request
app.post("/request-access", (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: "Name and Email are required" });
    }

    const requests = loadRequests();
    const newRequest = { id: Date.now(), name, email, status: "pending" };
    requests.push(newRequest);
    saveRequests(requests);

    res.status(201).json({ message: "Request submitted successfully", request: newRequest });
});

// 📌 Get all access requests
app.get("/requests", (req, res) => {
    res.json(loadRequests());
});

// 📌 Approve or Reject a request
app.put("/requests/:id", (req, res) => {
    const { status } = req.body; // "approved" or "rejected"
    if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    const requests = loadRequests();
    const requestIndex = requests.findIndex((req) => req.id == req.params.id);

    if (requestIndex === -1) {
        return res.status(404).json({ message: "Request not found" });
    }

    requests[requestIndex].status = status;
    saveRequests(requests);

    res.json({ message: `Request ${status}`, request: requests[requestIndex] });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
