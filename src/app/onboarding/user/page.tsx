"use client"
import React from 'react'
import CyberButton from '@/components/buttons/secondary'

const page = () => {
  return (
    <div>
      <CyberButton label="Start Monitoring" onClick={() => console.log("monitoring started")} />
    </div>
  )
}

export default page
