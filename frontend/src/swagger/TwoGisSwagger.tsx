import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

const ENV_API_KEY =
  import.meta.env.VITE_2GIS_API_KEY ||
  import.meta.env.VITE_DGIS_API_KEY ||
  import.meta.env.VITE_2GIS_KEY ||
  import.meta.env.VITE_DGIS_KEY

const requestInterceptor = (req: any) => {
  if (!ENV_API_KEY) return req

  try {
    const url = new URL(req.url, window.location.origin)
    const is2GisHost = url.hostname.includes('api.2gis.com') || url.hostname.includes('2gis.com')

    if (is2GisHost && !url.searchParams.has('key')) {
      url.searchParams.set('key', ENV_API_KEY as string)
      return { ...req, url: url.toString() }
    }
  } catch (error) {
    console.warn('Failed to inject 2GIS key', error)
  }

  return req
}

export function TwoGisSwagger() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <SwaggerUI
        url="/swagger/2gis-openapi.json"
        docExpansion="list"
        defaultModelsExpandDepth={-1}
        persistAuthorization
        requestInterceptor={requestInterceptor}
      />
    </div>
  )
}
