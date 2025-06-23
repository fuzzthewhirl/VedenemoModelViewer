import { useRef, useState } from 'react'

const WS_URL = `ws://${import.meta.env.VITE_API_HOST || 'localhost'}:${
  import.meta.env.VITE_API_PORT || '8080'
}/modelConnector`

export default function WebSocketStatus() {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<WebSocket | null>(null)

  const connect = () => {
    if (connected || socketRef.current) return
    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      setConnected(true)
      setError(null)
      console.log('Connected to WebSocket.')
    }

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data])
    }

    ws.onerror = () => {
      setError('WebSocket connection failed. Is the backend running?')
    }

    ws.onclose = () => {
      setConnected(false)
      socketRef.current = null
      console.log('Disconnected from WebSocket.')
    }

    socketRef.current = ws
  }

  const disconnect = () => {
    socketRef.current?.close()
    socketRef.current = null
    setConnected(false)
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>
        Status:{' '}
        <span style={{ color: connected ? 'green' : 'red' }}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </h2>
      <button onClick={connected ? disconnect : connect}>
        {connected ? 'Disconnect' : 'Connect'}
      </button>
      {error && (
        <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>
      )}
      <div style={{ marginTop: '1rem' }}>
        <h3>Received Messages</h3>
        <textarea
          readOnly
          value={messages.length > 0 ? messages.join('\\n') : 'No messages yet.'}
          rows={10}
          cols={50}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  )
}
