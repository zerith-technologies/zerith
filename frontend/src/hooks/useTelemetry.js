import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'

const WS_URL = 'ws://localhost:8080/ws'
const HISTORY_SIZE = 60

const PIDS = ['0x0B', '0x24', '0x0C', '0x0D', '0x05']

function emptyState() {
  return Object.fromEntries(PIDS.map(pid => [pid, { value: null, unit: '', name: '' }]))
}

export function useTelemetry() {
  const [readings, setReadings] = useState(emptyState)
  // history only for MAP (0x0B) and Lambda (0x24)
  const [history, setHistory] = useState({ '0x0B': [], '0x24': [] })
  const [status, setStatus] = useState('connecting') // connecting | connected | disconnected
  const clientRef = useRef(null)

  useEffect(() => {
    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 3000,
      onConnect: () => {
        setStatus('connected')
        client.subscribe('/topic/telemetry', (msg) => {
          const data = JSON.parse(msg.body)
          const pid = data.pid

          setReadings(prev => ({
            ...prev,
            [pid]: { value: data.value, unit: data.unit, name: data.name },
          }))

          if (pid === '0x0B' || pid === '0x24') {
            setHistory(prev => {
              const updated = [...prev[pid], { t: data.timestamp, value: data.value }]
              return { ...prev, [pid]: updated.slice(-HISTORY_SIZE) }
            })
          }
        })
      },
      onDisconnect: () => setStatus('disconnected'),
      onStompError: () => setStatus('disconnected'),
      onWebSocketError: () => setStatus('disconnected'),
    })

    client.activate()
    clientRef.current = client

    return () => client.deactivate()
  }, [])

  return { readings, history, status }
}
