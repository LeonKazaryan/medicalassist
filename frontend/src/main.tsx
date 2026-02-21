import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Providers } from './app/providers'
import { TwoGisSwagger } from './swagger/TwoGisSwagger'
import './styles/globals.css'

const isSwaggerRoute = window.location.pathname.startsWith('/swagger')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isSwaggerRoute ? (
      <TwoGisSwagger />
    ) : (
      <Providers>
        <App />
      </Providers>
    )}
  </React.StrictMode>,
)
