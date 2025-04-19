const ENV = {
  LOCAL: 'local',
  DEV: 'dev',
  TEST: 'test',
  PROD: 'prod'
};

// Current environment - can be changed based on build/deployment
const CURRENT_ENV = ENV.LOCAL;

const API_CONFIG = {
  [ENV.LOCAL]: 'http://localhost:8000',
  [ENV.DEV]: 'http://dev-api.example.com',
  [ENV.TEST]: 'http://test-api.example.com',
  [ENV.PROD]: 'http://api.example.com'
};

export const API_BASE_URL = API_CONFIG[CURRENT_ENV]; 