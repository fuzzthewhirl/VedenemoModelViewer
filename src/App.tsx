import { useEffect, useRef, useState } from 'react'

const WS_URL = `ws://${__API_HOST__}:${__API_PORT__}/modelConnector`

function App() {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<string[]>([])
  const socketRef = useRef<WebSocket | null>(null)

  const connect = () => {
    if (connected || socketRef.current) return
    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      setConnected(true)
      console.log('WebSocket connected')
    }

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data])
    }

    ws.onclose = () => {
      setConnected(false)
      socketRef.current = null
      console.log('WebSocket disconnected')
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
      <div style={{ marginTop: '1rem' }}>
        <h3>Received Messages</h3>
        <textarea
          readOnly
          value={messages.join('\n')}
          rows={10}
          cols={50}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  )
}

export default App
