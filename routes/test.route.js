const express = require('express');
const router = express.Router();
const TestController = require('../controllers/test.controller');
const test_controller = new TestController();

/**
 * @swagger
 * 
 * /test:
 *   get:
 *     summary: Test API Summary
 *     description: Test API Description
 *     tags:
 *      - Test
 *     responses:
 *       '200':
 *         description: A test result.
 */
router.get('/', test_controller.test.bind(test_controller));

module.exports = router;