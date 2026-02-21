import { useState, useCallback } from 'react'
import { useMapStore } from '../state/mapStore'
import { GEOLOCATION_TIMEOUT } from '@/lib/config/map'

export function useUserGeolocation() {
  const [error, setError] = useState<string | null>(null)
  const { userLocation, geolocationStatus, setUserLocation, setGeolocationStatus } =
    useMapStore((state) => ({
      userLocation: state.userLocation,
      geolocationStatus: state.geolocationStatus,
      setUserLocation: state.setUserLocation,
      setGeolocationStatus: state.setGeolocationStatus,
    }))

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается в этом браузере')
      setGeolocationStatus('error')
      return
    }

    setError(null)
    setGeolocationStatus('loading')

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        setGeolocationStatus('granted')
      },
      (err) => {
        const denied = err.code === err.PERMISSION_DENIED
        setGeolocationStatus(denied ? 'denied' : 'error')
        setError(
          denied
            ? 'Доступ к геолокации отклонен'
            : 'Не удалось получить геопозицию',
        )
      },
      {
        enableHighAccuracy: false,
        timeout: GEOLOCATION_TIMEOUT,
        maximumAge: 0,
      },
    )
  }, [setGeolocationStatus, setUserLocation])

  return {
    userLocation,
    geolocationStatus,
    error,
    requestLocation,
  }
}
