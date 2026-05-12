import { useState, useEffect, useRef, useCallback } from 'react'
import { Client } from '@stomp/stompjs'

export const VEHICLES = [
  { id: 'mobi',    name: 'Mobi',    color: '#3b82f6' },
  { id: 'saveiro', name: 'Saveiro', color: '#10b981' },
  { id: 'polo',    name: 'Polo',    color: '#f59e0b' },
  { id: 'strada',  name: 'Strada',  color: '#ef4444' },
  { id: 'argo',    name: 'Argo',    color: '#a855f7' },
]

const INITIAL_SENSORS = {
  '0x05': { pid: '0x05', name: 'temp_c',    value: null, unit: '°C'  },
  '0x0B': { pid: '0x0B', name: 'map_kpa',   value: null, unit: 'kPa' },
  '0x0C': { pid: '0x0C', name: 'rpm',       value: null, unit: 'rpm' },
  '0x0D': { pid: '0x0D', name: 'speed_kmh', value: null, unit: 'km/h'},
  '0x24': { pid: '0x24', name: 'lambda',    value: null, unit: 'A/F' },
}

function buildInitialFleet() {
  return VEHICLES.reduce((acc, v) => {
    acc[v.id] = { ...v, sensors: structuredClone(INITIAL_SENSORS), alerts: [], score: 100, status: 'ok' }
    return acc
  }, {})
}

function classifyAlert(pid, value) {
  if (pid === '0x05') {
    if (value > 100) return 'danger'
    if (value > 90)  return 'warning'
  }
  if (pid === '0x0D') {
    if (value > 100) return 'danger'
    if (value > 80)  return 'warning'
  }
  if (pid === '0x0C') {
    if (value > 6000) return 'danger'
    if (value > 5000) return 'warning'
  }
  if (pid === '0x24') {
    if (value < 12.0 || value > 17.0) return 'danger'
    if (value < 13.5 || value > 15.5) return 'warning'
  }
  return 'ok'
}

function deriveScore(sensors) {
  let deductions = 0
  for (const s of Object.values(sensors)) {
    if (s.value === null) continue
    const level = classifyAlert(s.pid, s.value)
    if (level === 'danger')  deductions += 20
    if (level === 'warning') deductions += 8
  }
  return Math.max(0, 100 - deductions)
}

function deriveStatus(sensors) {
  const active = Object.values(sensors).filter(s => s.value !== null)
  if (active.some(s => classifyAlert(s.pid, s.value) === 'danger'))  return 'danger'
  if (active.some(s => classifyAlert(s.pid, s.value) === 'warning')) return 'warning'
  return 'ok'
}

export function useFleet() {
  const [fleet, setFleet]               = useState(buildInitialFleet)
  const [activeVehicleId, setActiveId]  = useState('mobi')
  const [wsStatus, setWsStatus]         = useState('disconnected')

  const activeIdRef = useRef('mobi')
  useEffect(() => { activeIdRef.current = activeVehicleId }, [activeVehicleId])

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL ??
      `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`
    console.log('[useFleet] Connecting to:', wsUrl)
    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
    })

    client.onConnect = () => {
      console.log('[useFleet] STOMP connected')
      setWsStatus('connected')

      client.subscribe('/topic/telemetry', (msg) => {
        try {
          const data = JSON.parse(msg.body)
          const targetId = data.vehicleId ?? activeIdRef.current

          setFleet(prev => {
            const vehicle = prev[targetId]
            if (!vehicle) return prev

            const updatedSensors = {
              ...vehicle.sensors,
              [data.pid]: { pid: data.pid, name: data.name, value: data.value, unit: data.unit },
            }

            const level = classifyAlert(data.pid, data.value)
            const updatedAlerts = level === 'ok'
              ? vehicle.alerts
              : [
                  { id: `${Date.now()}-${Math.random()}`, timestamp: data.timestamp,
                    pid: data.pid, name: data.name, value: data.value, unit: data.unit, level },
                  ...vehicle.alerts,
                ].slice(0, 50)

            return {
              ...prev,
              [targetId]: {
                ...vehicle,
                sensors: updatedSensors,
                alerts: updatedAlerts,
                score:  deriveScore(updatedSensors),
                status: deriveStatus(updatedSensors),
              },
            }
          })
        } catch (_) {}
      })
    }

    client.onDisconnect  = () => { console.log('[useFleet] STOMP disconnected'); setWsStatus('disconnected') }
    client.onStompError  = (frame) => { console.error('[useFleet] STOMP error:', frame); setWsStatus('error') }

    client.activate()
    return () => { client.deactivate() }
  }, [])

  const spinTo = useCallback((vehicleId) => {
    setActiveId(vehicleId)
  }, [])

  return {
    fleet,
    vehicles: VEHICLES,
    activeVehicleId,
    activeVehicle: fleet[activeVehicleId],
    wsStatus,
    spinTo,
  }
}
