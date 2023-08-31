import React from 'react'
import { Flex, Text, IconButton, AddIcon, MinusIcon, useModal, Skeleton } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'
import { DeserializedPool } from 'state/types'
import { usePriceSobaBusd } from 'state/farms/hooks'
import { useSobaVault } from 'state/pools/hooks'
import Balance from 'components/Balance'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import { convertSharesToSoba } from '../../../helpers'
import VaultStakeModal from '../VaultStakeModal'

interface HasStakeActionProps {
  pool: DeserializedPool
  stakingTokenBalance: BigNumber
  performanceFee: number
}

const HasSharesActions: React.FC<HasStakeActionProps> = ({ pool, stakingTokenBalance, performanceFee }) => {
  const {
    userData: { userShares },
    pricePerFullShare,
  } = useSobaVault()
  const { stakingToken } = pool
  const { sobaAsBigNumber, sobaAsNumberBalance } = convertSharesToSoba(userShares, pricePerFullShare)
  const sobaPriceBusd = usePriceSobaBusd()
  const stakedDollarValue = sobaPriceBusd.gt(0)
    ? getBalanceNumber(sobaAsBigNumber.multipliedBy(sobaPriceBusd), stakingToken.decimals)
    : 0

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)
  const [onPresentStake] = useModal(
    <VaultStakeModal stakingMax={stakingTokenBalance} performanceFee={performanceFee} pool={pool} />,
  )
  const [onPresentUnstake] = useModal(<VaultStakeModal stakingMax={sobaAsBigNumber} pool={pool} isRemovingStake />)

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column">
        <Balance fontSize="20px" bold value={sobaAsNumberBalance} decimals={5} />
        <Text fontSize="12px" color="textSubtle">
          {sobaPriceBusd.gt(0) ? (
            <Balance value={stakedDollarValue} fontSize="12px" color="textSubtle" decimals={2} prefix="~" unit=" USD" />
          ) : (
            <Skeleton mt="1px" height={16} width={64} />
          )}
        </Text>
      </Flex>
      <Flex>
        <IconButton variant="secondary" onClick={onPresentUnstake} mr="6px">
          <MinusIcon color="primary" width="24px" />
        </IconButton>
        <IconButton variant="secondary" onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}>
          <AddIcon color="primary" width="24px" height="24px" />
        </IconButton>
      </Flex>
    </Flex>
  )
}

export default HasSharesActions
