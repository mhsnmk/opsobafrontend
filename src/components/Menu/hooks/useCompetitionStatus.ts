import useSWRImmutable from 'swr/immutable'
import { useMemo } from 'react'
import { SmartContractPhases, LIVE, REGISTRATION } from 'config/constants/trading-competition/phases'
import { useTradingCompetitionContract } from 'hooks/useContract'

export const useCompetitionStatus = () => {
  const tradingCompetitionContract = useTradingCompetitionContract()

  const { data: state } = useSWRImmutable('competitionStatus', async () => {
    const competitionStatus = await tradingCompetitionContract.currentStatus()
    return SmartContractPhases[competitionStatus].state
  })

  return useMemo(() => {
    if (state === REGISTRATION) {
      return 'soon'
    }

    if (state === LIVE) {
      return 'live'
    }

    return null
  }, [state])
}
