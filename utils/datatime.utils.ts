export const getTimeDiff = (completeDate: Date) => {
  const currentTime = new Date().getTime()
  const givenTime = new Date(completeDate).getTime()
  const timeDiff = givenTime - currentTime
  return timeDiff
}
