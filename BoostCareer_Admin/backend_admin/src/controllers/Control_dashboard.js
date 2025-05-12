const connection = require('../config/databaseConfig');
const constant_response = require('../config/constant_response');

const dashboardController = {
  // Get general statistics for dashboard
  getDashboardStats: async (req, res) => {
    try {
      // Query to get total number of jobseekers
      const jobseekerCountQuery = "SELECT COUNT(*) as totalJobseekers FROM jobseekers";
      
      // Query to get total number of employers
      const employerCountQuery = "SELECT COUNT(*) as totalEmployers FROM employers";
      
      // Query to get total number of job posts
      const jobCountQuery = "SELECT COUNT(*) as totalJobs FROM jobs";
      
      // Execute the queries
      connection.query(jobseekerCountQuery, (err1, jobseekerResults) => {
        if (err1) {
          console.error("Error fetching jobseeker count:", err1);
          return res.status(500).json({
            status: constant_response.STATUS.ERROR,
            message: constant_response.MESSAGE.SERVER_ERROR
          });
        }

        connection.query(employerCountQuery, (err2, employerResults) => {
          if (err2) {
            console.error("Error fetching employer count:", err2);
            return res.status(500).json({
              status: constant_response.STATUS.ERROR,
              message: constant_response.MESSAGE.SERVER_ERROR
            });
          }

          connection.query(jobCountQuery, (err3, jobResults) => {
            if (err3) {
              console.error("Error fetching job count:", err3);
              return res.status(500).json({
                status: constant_response.STATUS.ERROR,
                message: constant_response.MESSAGE.SERVER_ERROR
              });
            }

            // Combine all stats into one response
            const stats = {
              totalJobseekers: jobseekerResults[0].totalJobseekers,
              totalEmployers: employerResults[0].totalEmployers,
              totalJobs: jobResults[0].totalJobs
            };

            return res.status(200).json({
              status: constant_response.STATUS.SUCCESS,
              data: stats,
              message: "Dashboard statistics retrieved successfully"
            });
          });
        });
      });
    } catch (error) {
      console.error("Error in getDashboardStats:", error);
      return res.status(500).json({
        status: constant_response.STATUS.ERROR,
        message: constant_response.MESSAGE.SERVER_ERROR
      });
    }
  },

  // Get average profile completion rate for jobseekers
  getProfileCompletionRate: (req, res) => {
    try {
      // This is a placeholder query - you'll need to adjust based on your actual database schema
      // Example: If you have fields that indicate profile completion, calculate the average
      const query = `
        SELECT AVG(
          (CASE WHEN profile_photo IS NOT NULL THEN 1 ELSE 0 END +
           CASE WHEN about IS NOT NULL AND about != '' THEN 1 ELSE 0 END +
           CASE WHEN education IS NOT NULL AND education != '' THEN 1 ELSE 0 END +
           CASE WHEN experience IS NOT NULL AND experience != '' THEN 1 ELSE 0 END +
           CASE WHEN skills IS NOT NULL AND skills != '' THEN 1 ELSE 0 END) / 5 * 100
        ) as completionRate
        FROM jobseekers
      `;
      
      connection.query(query, (err, results) => {
        if (err) {
          console.error("Error fetching profile completion rate:", err);
          return res.status(500).json({
            status: constant_response.STATUS.ERROR,
            message: constant_response.MESSAGE.SERVER_ERROR
          });
        }
        
        // Round to 2 decimal places
        const completionRate = Math.round(results[0].completionRate || 0);
        
        return res.status(200).json({
          status: constant_response.STATUS.SUCCESS,
          data: { completionRate },
          message: "Profile completion rate retrieved successfully"
        });
      });
    } catch (error) {
      console.error("Error in getProfileCompletionRate:", error);
      return res.status(500).json({
        status: constant_response.STATUS.ERROR,
        message: constant_response.MESSAGE.SERVER_ERROR
      });
    }
  },

  // Get percentage of employers with active job posts
  getEmployersWithJobsRate: (req, res) => {
    try {
      // Query to get percentage of employers with active jobs
      // Adjust this based on your actual database schema
      const query = `
        SELECT 
          (COUNT(DISTINCT e.employer_id) / (SELECT COUNT(*) FROM employers)) * 100 as rate
        FROM 
          employers e
        INNER JOIN 
          jobs j ON e.employer_id = j.employer_id
        WHERE 
          j.status = 'active'
      `;
      
      connection.query(query, (err, results) => {
        if (err) {
          console.error("Error fetching employers with jobs rate:", err);
          return res.status(500).json({
            status: constant_response.STATUS.ERROR,
            message: constant_response.MESSAGE.SERVER_ERROR
          });
        }
        
        // Round to nearest integer
        const rate = Math.round(results[0].rate || 0);
        
        return res.status(200).json({
          status: constant_response.STATUS.SUCCESS,
          data: { rate },
          message: "Employers with active jobs rate retrieved successfully"
        });
      });
    } catch (error) {
      console.error("Error in getEmployersWithJobsRate:", error);
      return res.status(500).json({
        status: constant_response.STATUS.ERROR,
        message: constant_response.MESSAGE.SERVER_ERROR
      });
    }
  },
  // Get total reviews count and average ratings
  getTotalReviews: (req, res) => {
    try {
      // Query to get total number and average rating of company reviews
      // Adjust query based on your actual database schema
      const companyReviewsQuery = `
        SELECT 
          COUNT(*) as companyReviews,
          AVG(rating) as companyAvgRating
        FROM company_reviews
      `;
      
      // Query to get total number and average rating of candidate ratings
      const candidateRatingsQuery = `
        SELECT 
          COUNT(*) as candidateRatings,
          AVG(rating) as candidateAvgRating
        FROM candidate_ratings
      `;
      
      connection.query(companyReviewsQuery, (err1, companyResults) => {
        if (err1) {
          console.error("Error fetching company reviews data:", err1);
          return res.status(500).json({
            status: constant_response.STATUS.ERROR,
            message: constant_response.MESSAGE.SERVER_ERROR
          });
        }

        connection.query(candidateRatingsQuery, (err2, candidateResults) => {
          if (err2) {
            console.error("Error fetching candidate ratings data:", err2);
            return res.status(500).json({
              status: constant_response.STATUS.ERROR,
              message: constant_response.MESSAGE.SERVER_ERROR
            });
          }

          // Round average ratings to one decimal place
          const companyAvgRating = Math.round((companyResults[0].companyAvgRating || 0) * 10) / 10;
          const candidateAvgRating = Math.round((candidateResults[0].candidateAvgRating || 0) * 10) / 10;

          const reviewsData = {
            companyReviews: companyResults[0].companyReviews || 0,
            companyAvgRating: companyAvgRating,
            candidateRatings: candidateResults[0].candidateRatings || 0,
            candidateAvgRating: candidateAvgRating
          };

          return res.status(200).json({
            status: constant_response.STATUS.SUCCESS,
            data: reviewsData,
            message: "Reviews data retrieved successfully"
          });
        });
      });
    } catch (error) {
      console.error("Error in getTotalReviews:", error);
      return res.status(500).json({
        status: constant_response.STATUS.ERROR,
        message: constant_response.MESSAGE.SERVER_ERROR
      });
    }
  },

  // Get growth statistics over time
  getGrowthStats: (req, res) => {
    try {
      const { period, startDate, endDate } = req.body;
      
      // Default to month if period is not specified
      const timePeriod = period || 'month';
      
      // Format the date grouping based on period
      let dateFormat;
      switch(timePeriod) {
        case 'day':
          dateFormat = '%Y-%m-%d';
          break;
        case 'month':
          dateFormat = '%Y-%m';
          break;
        case 'year':
          dateFormat = '%Y';
          break;
        default:
          dateFormat = '%Y-%m';
      }
      
      // Query to get new jobseekers over time
      const jobseekersQuery = `
        SELECT 
          DATE_FORMAT(created_at, '${dateFormat}') as period,
          COUNT(*) as count
        FROM 
          jobseekers
        WHERE 
          created_at BETWEEN ? AND ?
        GROUP BY 
          DATE_FORMAT(created_at, '${dateFormat}')
        ORDER BY 
          period ASC
      `;
      
      // Query to get new employers over time
      const employersQuery = `
        SELECT 
          DATE_FORMAT(created_at, '${dateFormat}') as period,
          COUNT(*) as count
        FROM 
          employers
        WHERE 
          created_at BETWEEN ? AND ?
        GROUP BY 
          DATE_FORMAT(created_at, '${dateFormat}')
        ORDER BY 
          period ASC
      `;
      
      // Query to get new jobs over time
      const jobsQuery = `
        SELECT 
          DATE_FORMAT(created_at, '${dateFormat}') as period,
          COUNT(*) as count
        FROM 
          jobs
        WHERE 
          created_at BETWEEN ? AND ?
        GROUP BY 
          DATE_FORMAT(created_at, '${dateFormat}')
        ORDER BY 
          period ASC
      `;
      
      connection.query(jobseekersQuery, [startDate, endDate], (err1, jobseekersResults) => {
        if (err1) {
          console.error("Error fetching jobseekers growth:", err1);
          return res.status(500).json({
            status: constant_response.STATUS.ERROR,
            message: constant_response.MESSAGE.SERVER_ERROR
          });
        }

        connection.query(employersQuery, [startDate, endDate], (err2, employersResults) => {
          if (err2) {
            console.error("Error fetching employers growth:", err2);
            return res.status(500).json({
              status: constant_response.STATUS.ERROR,
              message: constant_response.MESSAGE.SERVER_ERROR
            });
          }

          connection.query(jobsQuery, [startDate, endDate], (err3, jobsResults) => {
            if (err3) {
              console.error("Error fetching jobs growth:", err3);
              return res.status(500).json({
                status: constant_response.STATUS.ERROR,
                message: constant_response.MESSAGE.SERVER_ERROR
              });
            }

            // Process the results into the format needed for the chart
            const periods = [...new Set([
              ...jobseekersResults.map(item => item.period),
              ...employersResults.map(item => item.period),
              ...jobsResults.map(item => item.period)
            ])].sort();
            
            const newJobseekers = [];
            const newEmployers = [];
            const newJobs = [];
            
            periods.forEach(period => {
              const jobseeker = jobseekersResults.find(item => item.period === period);
              const employer = employersResults.find(item => item.period === period);
              const job = jobsResults.find(item => item.period === period);
              
              newJobseekers.push(jobseeker ? jobseeker.count : 0);
              newEmployers.push(employer ? employer.count : 0);
              newJobs.push(job ? job.count : 0);
            });
            
            const growthData = {
              labels: periods,
              newJobseekers,
              newEmployers,
              newJobs
            };

            return res.status(200).json({
              status: constant_response.STATUS.SUCCESS,
              data: growthData,
              message: "Growth statistics retrieved successfully"
            });
          });
        });
      });
    } catch (error) {
      console.error("Error in getGrowthStats:", error);
      return res.status(500).json({
        status: constant_response.STATUS.ERROR,
        message: constant_response.MESSAGE.SERVER_ERROR
      });
    }
  }
};

module.exports = dashboardController;
