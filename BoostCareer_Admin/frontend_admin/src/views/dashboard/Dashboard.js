import React from 'react'

// Import our custom dashboard components
import StatsWidget from './StatsWidget'
import SecondRowStats from './SecondRowStats'
import GrowthChart from './GrowthChart'

const Dashboard = () => {
  return (
    <>
      {/* First row - Statistics cards showing total jobseekers, employers, job posts */}
      <StatsWidget />
      
      {/* Second row - Charts showing jobseeker profile completion rate, employers with jobs, reviews */}
      <SecondRowStats />
      
      {/* Third row - Growth trends chart */}
      <GrowthChart />
    </>
  )
}

export default Dashboard
