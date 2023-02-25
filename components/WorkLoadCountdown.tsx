import React, { useState, useEffect } from "react"

type CountdownProps = {
  targetTime: Date
}

const Countdown: React.FC<CountdownProps> = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date()
      const bufferTime = 1000
      const diff = Math.floor(
        (targetTime.getTime() + bufferTime - currentTime.getTime()) / 1000
      )
      setTimeLeft(diff)
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [targetTime])

  return <div>{timeLeft} seconds remaining...</div>
}

export default Countdown
