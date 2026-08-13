/**
 * Stella AI Enterprise WebSocket Client
 * Connects to: ws://localhost:8080/interview/{sessionId}
 */
export class WebSocketClient {
  constructor(sessionId, options = {}) {
    this.sessionId = sessionId;
    this.url = options.url || `ws://localhost:8000/ws/interview/${sessionId}`;
    this.onMessageCallback = null;
    this.onStatusChangeCallback = null;
    this.socket = null;
    this.status = 'DISCONNECTED'; // CONNECTED, RECONNECTING, DISCONNECTED
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = 3000;
    this.isMockMode = false;
    this.mockTimer = null;
  }

  connect() {
    this._updateStatus('RECONNECTING');
    
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        this.isMockMode = false;
        this._updateStatus('CONNECTED');
        console.log('WebSocket successfully connected to server:', this.url);
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (this.onMessageCallback) {
            this.onMessageCallback(data);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message content:', err);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket connection error:', error);
      };

      this.socket.onclose = () => {
        this._handleDisconnect();
      };
    } catch (e) {
      console.warn('Failed to construct WebSocket. Enabling mock simulation engine fallback.');
      this._enableMockSimulation();
    }
  }

  send(data) {
    if (this.isMockMode) {
      this._handleMockReceive(data);
      return;
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        sessionId: this.sessionId,
        ...data
      }));
    } else {
      console.error('Cannot send message. WebSocket is closed. Current state:', this.status);
    }
  }

  disconnect() {
    this._updateStatus('DISCONNECTED');
    if (this.socket) {
      this.socket.onclose = null; // Prevent reconnect loop
      this.socket.close();
      this.socket = null;
    }
    if (this.mockTimer) {
      clearTimeout(this.mockTimer);
    }
  }

  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  onStatusChange(callback) {
    this.onStatusChangeCallback = callback;
  }

  _updateStatus(newStatus) {
    this.status = newStatus;
    if (this.onStatusChangeCallback) {
      this.onStatusChangeCallback(newStatus);
    }
  }

  _handleDisconnect() {
    if (this.status === 'DISCONNECTED') return;

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this._updateStatus('RECONNECTING');
      this.reconnectAttempts++;
      console.log(`WebSocket disconnected. Reconnecting attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectTimeout);
    } else {
      console.warn('Max reconnect attempts reached. Switching to modern local AI mock simulator.');
      this._enableMockSimulation();
    }
  }

  _enableMockSimulation() {
    this.isMockMode = true;
    this._updateStatus('CONNECTED');
    
    // Trigger initial question from Stella AI
    setTimeout(() => {
      this._triggerMockServerMessage({
        event: 'ai_question',
        question: 'Welcome! Let us start our interview. Could you explain the key architectural lifecycle stages of a modern web application?',
        difficulty: 'easy'
      });
    }, 1500);
  }

  _triggerMockServerMessage(message) {
    if (this.onMessageCallback) {
      this.onMessageCallback(message);
    }
  }

  _handleMockReceive(clientMessage) {
    console.log('Mock WebSocket client message received:', clientMessage);
    
    if (clientMessage.event === 'candidate_answer') {
      // 1. Instantly echo candidate's transcript block to simulate transcript update event
      setTimeout(() => {
        this._triggerMockServerMessage({
          event: 'transcript_update',
          speaker: 'candidate',
          text: clientMessage.text
        });
      }, 400);

      // 2. Generate custom scorecard/evaluation feedback metrics
      setTimeout(() => {
        const score = Math.floor(Math.random() * 15) + 80; // random score between 80 and 95
        this._triggerMockServerMessage({
          event: 'evaluation_update',
          score,
          feedback: `Great input on structural layout rendering. Scorecard logged with ${score}% rating.`
        });
      }, 1500);

      // 3. Trigger next AI follow-up question
      setTimeout(() => {
        const nextQuestions = [
          "Fascinating. Going deeper, how do you handle asynchronous telemetry streaming or continuous network failures inside your code wrappers?",
          "Excellent, let us pivot. Describe your architectural design strategy to maintain stateless token credentials secure from high-volume credential stuffing.",
          "Perfect. Finally, how do you approach database partitioning, distributed replication, and eventual consistency in high-availability environments?"
        ];
        const randomQ = nextQuestions[Math.floor(Math.random() * nextQuestions.length)];
        
        this._triggerMockServerMessage({
          event: 'ai_question',
          question: randomQ,
          difficulty: 'medium'
        });
      }, 4500);
    }
  }
}

export default WebSocketClient;
