import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketClient } from '../services/websocketClient';

export default function useWebSocket(sessionId) {
  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
  const [latestMessage, setLatestMessage] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;

    // Create the websocket client
    const client = new WebSocketClient(sessionId);
    clientRef.current = client;

    // Listen to connection status events
    client.onStatusChange((status) => {
      setConnectionStatus(status);
    });

    // Listen to server message events
    client.onMessage((msg) => {
      setLatestMessage(msg);
    });

    // Initiate connection
    client.connect();

    // Clean up on component unmount
    return () => {
      client.disconnect();
    };
  }, [sessionId]);

  // Send message helper
  const sendMessage = useCallback((event, payload = {}) => {
    if (clientRef.current) {
      clientRef.current.send({
        event,
        ...payload
      });
    } else {
      console.error('Cannot send message. WebSocket client is not initialized.');
    }
  }, []);

  return {
    connectionStatus, // CONNECTED, RECONNECTING, DISCONNECTED
    latestMessage,
    sendMessage
  };
}
