const db = require('../models/database');
const { validateEmail, validateName } = require('../utils/validation');

const createRequest = async (req, res) => {
    const { name, email } = req.body;

    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
        return res.status(400).json({ message: nameValidation.error });
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
        return res.status(400).json({ message: emailValidation.error });
    }

    try {
        const newRequest = await db.createRequest(nameValidation.name, emailValidation.email);
        res.status(201).json({ message: "Request submitted successfully", request: newRequest });
    } catch (err) {
        console.error(err);
        if (err.message === "Email already registered") {
            return res.status(409).json({ message: "Email already has a pending request" });
        }
        res.status(500).json({ message: "Error creating request" });
    }
};

const getAllRequests = async (req, res) => {
    try {
        const requests = await db.getAllRequests();
        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching requests" });
    }
};

const checkStatus = async (req, res) => {
    const { email } = req.body;
    
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
        return res.status(400).json({ message: emailValidation.error });
    }

    try {
        const requests = await db.getRequestsByEmail(emailValidation.email);
        if (requests.length === 0) {
            return res.status(404).json({ message: "No requests found for this email" });
        }
        res.json({ requests });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error checking status" });
    }
};

const updateRequestStatus = async (req, res) => {
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
};

module.exports = {
    createRequest,
    getAllRequests,
    checkStatus,
    updateRequestStatus
};
