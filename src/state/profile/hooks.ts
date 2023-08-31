import { useEffect } from 'react'
import { useWeb3React } from 'hooks/useWeb3React'
import { useSelector } from 'react-redux'
import { isAddress } from 'utils'
import { useAppDispatch } from 'state'
import { getAchievements } from 'state/achievements/helpers'
import useSWRImmutable from 'swr/immutable'
import { FetchStatus } from 'config/constants/types'
import { State, ProfileState } from '../types'
import { fetchProfile, fetchProfileAvatar, fetchProfileUsername } from '.'
import { getProfile } from './helpers'


export const useProfileForAddress = (address: string) => {
  const { data, status } = useSWRImmutable([address, 'profile'], () => getProfile(address))

  return {
    profile: data,
    isFetching: status === FetchStatus.Fetching,
  }
}

export const useAchievementsForAddress = (address: string) => {
  const { data, status } = useSWRImmutable([address, 'achievements'], () => getAchievements(address))

  return {
    achievements: data || [],
    isFetching: status === FetchStatus.Fetching,
  }
}

export const useProfile = () => {
  const { isInitialized, isLoading, data, hasRegistered }: ProfileState = useSelector((state: State) => state.profile)
  return { profile: data, hasProfile: isInitialized && hasRegistered, isInitialized, isLoading }
}

/* export const useGetProfileAvatar = (account: string) => {
  const profileAvatar = useSelector((state: State) => state.profile.profileAvatars[account])
  const { username, nft, hasRegistered, usernameFetchStatus, avatarFetchStatus } = profileAvatar || {}
  const dispatch = useAppDispatch()

  useEffect(() => {
    const address = isAddress(account)

    if (!nft && avatarFetchStatus !== FetchStatus.Fetched && address) {
      dispatch(fetchProfileAvatar(account))
    }

    if (
      !username &&
      avatarFetchStatus === FetchStatus.Fetched &&
      usernameFetchStatus !== FetchStatus.Fetched &&
      address
    ) {
      dispatch(fetchProfileUsername({ account, hasRegistered }))
    }
  }, [account, nft, username, hasRegistered, avatarFetchStatus, usernameFetchStatus, dispatch])

  return { username, nft, usernameFetchStatus, avatarFetchStatus }
} */
