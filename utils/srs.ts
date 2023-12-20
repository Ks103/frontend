export function getSrsCid(k: number) {
  let generalParams: string
  let circuitVerifyingKey: string
  switch (k) {
    case 19:
      generalParams = 'QmeJngu5KuP4NjCimnkZjoGHt5xUY2eSmoADiZTf6WUwHG'
      circuitVerifyingKey = 'QmWGqxjCWrReL3WQy86g56dJ1hKY9miB91rnjLzHeeGivo'
      break
    default:
      throw new Error(
        `currently there are no whitelisted SRS for k = ${k} in this client`
      )
  }
  return {
    generalParams,
    circuitVerifyingKey,
  }
}
