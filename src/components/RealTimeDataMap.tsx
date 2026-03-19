'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

const MAPBOX_STYLE = 'mapbox://styles/da-tracker/cmmvkggcf00i401subi6a2hzv'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export default function RealTimeDataMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) {
      return
    }

    if (!MAPBOX_TOKEN) {
      // Do not attempt to initialize the map if token is missing
      return
    }

    mapboxgl.accessToken = MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_STYLE,
      center: [-98.5795, 39.8283], // Continental US
      zoom: 3.5,
      scrollZoom: true,
      dragPan: true,
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  const showTokenWarning = !MAPBOX_TOKEN

  return (
    <div className="glass-effect rounded-2xl p-6 md:p-8 shadow-2xl">
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-3xl font-bold mb-2">
          <span className="text-california-blue">Real-Time</span>{' '}
          <span className="text-emergency-orange">Data Map</span>
        </h2>
        <p className="text-gray-700 text-sm md:text-base max-w-3xl mx-auto">
          Explore a live map that updates in real time with submissions from the public about federal, state, and local
          government disciplinary actions.
        </p>
      </div>

      <div className="relative w-full aspect-square max-h-[70vh] rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
        <div ref={mapContainerRef} className="absolute inset-0" />
        <div className="absolute right-3 top-3 flex flex-col rounded-md overflow-hidden shadow-md bg-white/90 border border-gray-200">
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 text-lg font-semibold border-b border-gray-200"
            onClick={() => mapRef.current?.zoomIn()}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 text-lg font-semibold border-b border-gray-200"
            onClick={() => mapRef.current?.zoomOut()}
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 text-lg"
            onClick={() =>
              mapRef.current?.fitBounds(
                [
                  [-125, 24], // Southwest (approx Hawaii/SoCal edge)
                  [-66.5, 50], // Northeast (Maine)
                ],
                { padding: 40, duration: 600 },
              )
            }
            aria-label="Reset view to United States"
          >
            ↺
          </button>
        </div>
      </div>

      {showTokenWarning && (
        <p className="mt-3 text-xs text-red-600 text-center">
          Map could not load: please set <code className="font-mono">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> in your
          <code className="font-mono">.env.local</code> file with your Mapbox public token.
        </p>
      )}
    </div>
  )
}

