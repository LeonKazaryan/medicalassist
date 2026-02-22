import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Providers } from './app/providers'
import { TwoGisSwagger } from './swagger/TwoGisSwagger'
import MapPage from './features/map/MapPage'
import './styles/globals.css'
import 'leaflet/dist/leaflet.css'
import './styles/map.css'

const pathname = window.location.pathname
const isSwaggerRoute = pathname.startsWith('/swagger')
const isMapRoute = pathname.startsWith('/map') || pathname.startsWith('/nearby')
const isHistoryRoute = pathname.startsWith('/history')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isSwaggerRoute ? (
      <TwoGisSwagger />
    ) : (
      <Providers>
        {isMapRoute ? <MapPage /> : <App isHistory={isHistoryRoute} />}
      </Providers>
    )}
  </React.StrictMode>,
)
