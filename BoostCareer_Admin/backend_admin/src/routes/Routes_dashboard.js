// Routes for dashboard statistics
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/Control_dashboard');

// Get overall statistics for dashboard
router.get('/stats', dashboardController.getDashboardStats);

// Get profile completion rate for jobseekers
router.get('/profile-completion-rate', dashboardController.getProfileCompletionRate);

// Get rate of employers with active jobs
router.get('/employers-with-jobs-rate', dashboardController.getEmployersWithJobsRate);

// Get total reviews count
router.get('/total-reviews', dashboardController.getTotalReviews);

// Get growth statistics
router.post('/growth-stats', dashboardController.getGrowthStats);

module.exports = router;
