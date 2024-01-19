const express = require('express');
const router = express.Router();
const trackerService = require('../services/trackerService');
const OperationResult = require('../common/OperationResult');
const { tryCatch } = require('../common/utils/tryCatch');


router.post('/api/tracker/receive-data',
    tryCatch(
        async (req, res) => {

            await trackerService.HandleReceiveData(req.body);
            var result = OperationResult.SuccessfulOperation();

            res.status(201).send(result);

        })
);

module.exports = router;

