/**
 * Stella AI Mock API Client
 * Future backend endpoints should be configured here.
 */

const delay = (ms) => new Promise(resolve => setTimeout(ms, delay));

export const api = {
  /**
   * Submit candidate configuration details.
   */
  async submitCandidateConfig(profile) {
    await delay(800);
    return {
      status: 'success',
      candidateId: `cand_${Math.random().toString(36).substring(2, 9)}`,
      profile
    };
  },

  /**
   * Fetch custom mock evaluation report cards.
   */
  async fetchEvaluationReport(candidateId) {
    await delay(1000);
    return {
      status: 'success',
      overallScore: 91,
      recommendation: 'Strong Hire',
      metrics: {
        technical: 92,
        problemSolving: 88,
        communication: 94
      }
    };
  }
};
export default api;
