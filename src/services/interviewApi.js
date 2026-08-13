import apiClient from './apiClient';

// Helper for simulated delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const interviewApi = {
  /**
   * 1. Authentication Endpoints
   */
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.warn('REST API unavailable. Falling back to mock auth response.');
      await delay(600);
      
      // Simulated successful auto-login for testing purposes
      const mockToken = "mock-jwt-token-xyz-123";
      const mockUser = { id: 'u_1', email, name: email.split('@')[0] };
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { token: mockToken, user: mockUser };
    }
  },

  async register(name, email, password) {
    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      return response.data;
    } catch (error) {
      console.warn('REST API unavailable. Falling back to mock registration response.');
      await delay(600);
      
      const mockToken = "mock-jwt-token-xyz-123";
      const mockUser = { id: 'u_1', email, name };
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { token: mockToken, user: mockUser };
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve(true);
  },

  /**
   * 2. Candidate Management Endpoints
   */
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await apiClient.post('/candidate/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.warn('REST API unavailable. Mocking resume skills extraction.');
      await delay(1200);
      return {
        fileName: file.name,
        extractedSkills: ['React', 'JavaScript (ES6)', 'Tailwind CSS', 'REST APIs', 'Node.js', 'WebSockets', 'Git'],
        experienceYears: 4,
        confidenceScore: 94
      };
    }
  },

  async getCandidateProfile(candidateId) {
    try {
      const response = await apiClient.get(`/candidate/profile/${candidateId}`);
      return response.data;
    } catch (error) {
      await delay(400);
      const user = JSON.parse(localStorage.getItem('user')) || { name: 'Sarah Jenkins', email: 'sarah@example.com' };
      return {
        id: candidateId || 'c_1',
        name: user.name,
        email: user.email,
        skills: ['React', 'JavaScript', 'HTML/CSS', 'Tailwind', 'REST APIs', 'WebSocket Integration'],
        interviewsCompleted: 2
      };
    }
  },

  /**
   * 3. Interview Setup & Session Management
   */
  async createInterviewSession(setupConfig) {
    try {
      const response = await apiClient.post('/interview/session', setupConfig);
      return response.data;
    } catch (error) {
      console.warn('REST API unavailable. Mocking session creation.');
      await delay(600);
      return {
        sessionId: `sess_${Math.random().toString(36).substring(2, 9)}`,
        status: 'READY',
        config: setupConfig,
        createdAt: new Date().toISOString()
      };
    }
  },

  async getInterviewHistory() {
    try {
      const response = await apiClient.get('/interview/history');
      return response.data;
    } catch (error) {
      await delay(400);
      return [
        { id: '1', role: 'Senior Frontend Engineer', type: 'Technical', date: '2026-08-11', duration: '30 mins', score: 92, recommendation: 'Strong Hire' },
        { id: '2', role: 'Backend Node/Java Engineer', type: 'System Design', date: '2026-08-05', duration: '45 mins', score: 78, recommendation: 'Hire' }
      ];
    }
  }
};

export default interviewApi;
