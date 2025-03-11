const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Request access routes
router.post('/request-access', requestController.createRequest);
router.get('/requests', requestController.getAllRequests);
router.get('/check-status', requestController.checkStatus);
router.put('/requests/:id', requestController.updateRequestStatus);

module.exports = router;
