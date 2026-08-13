import { useState, useEffect, useCallback } from 'react';
import useWebSocket from './useWebSocket';

export default function useInterviewSession(sessionId) {
  const { connectionStatus, latestMessage, sendMessage } = useWebSocket(sessionId);

  // Core Session States
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [transcripts, setTranscripts] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('Awaiting response...');
  const [questionCount, setQuestionNumber] = useState(0);
  const [topicsCovered, setTopicsCovered] = useState([]);

  // Listen for WebSocket incoming events
  useEffect(() => {
    if (!latestMessage) return;

    switch (latestMessage.event) {
      case 'ai_question':
        setCurrentQuestion(latestMessage.question);
        setDifficulty(latestMessage.difficulty || 'medium');
        setQuestionNumber(prev => prev + 1);
        
        // Accumulate topics dynamically from question keywords
        const keywords = ['lifecycle', 'render', 'state', 'token', 'cache', 'distributed', 'security', 'stateless', 'replica', 'transaction'];
        const matched = keywords.filter(word => latestMessage.question.toLowerCase().includes(word));
        if (matched.length > 0) {
          setTopicsCovered(prev => {
            const next = [...prev];
            matched.forEach(topic => {
              if (!next.includes(topic)) {
                next.push(topic.charAt(0).toUpperCase() + topic.slice(1));
              }
            });
            return next;
          });
        }
        break;

      case 'transcript_update':
        setTranscripts(prev => [
          ...prev,
          { 
            speaker: latestMessage.speaker, 
            text: latestMessage.text, 
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
          }
        ]);
        break;

      case 'evaluation_update':
        setScore(latestMessage.score);
        setFeedback(latestMessage.feedback);
        break;

      default:
        console.warn('Unhandled websocket event type:', latestMessage.event);
    }
  }, [latestMessage]);

  // Submit Answer Action
  const submitCandidateAnswer = useCallback((answerText) => {
    if (!answerText.trim()) return;

    // 1. Instantly push client answer locally into transcript
    setTranscripts(prev => [
      ...prev,
      { 
        speaker: 'candidate', 
        text: answerText, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
      }
    ]);

    // 2. Transmit event via WebSocket layer
    sendMessage('candidate_answer', {
      text: answerText,
      audioChunk: null // Audio base64 blob can go here in future expansion
    });
  }, [sendMessage]);

  return {
    connectionStatus,
    currentQuestion,
    difficulty,
    transcripts,
    score,
    feedback,
    questionCount,
    topicsCovered,
    submitCandidateAnswer
  };
}
export default useInterviewSession;
