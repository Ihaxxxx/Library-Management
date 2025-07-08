import React from 'react'
import Navbar from '../components/Navbar'
import {ChartBarLabelCustom}  from '../components/BarChart.tsx'

function Home() {
  return (
    <>
    <Navbar></Navbar>
    <div>Home</div>
    <ChartBarLabelCustom></ChartBarLabelCustom>
    </>
  )
}

export default Home