const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Request access routes
router.post('/request-access', requestController.createRequest);
router.post('/check-status', requestController.checkStatus);
router.get('/requests', requestController.getAllRequests);
router.put('/requests/:id', requestController.updateRequestStatus);
router.delete('/requests/:id', requestController.deleteRequest);

module.exports = router;
