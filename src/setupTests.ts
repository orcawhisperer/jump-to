// src/setupTests.ts
import '@testing-library/jest-dom';

// Mock chrome API
global.chrome = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn()
    }
  },
  runtime: {
    lastError: null
  },
  tabs: {
    create: jest.fn(),
    update: jest.fn()
  },
  commands: {
    onCommand: {
      addListener: jest.fn()
    }
  },
  webNavigation: {
    onBeforeNavigate: {
      addListener: jest.fn()
    }
  },
  omnibox: {
    onInputChanged: {
      addListener: jest.fn()
    },
    onInputEntered: {
      addListener: jest.fn()
    }
  }
} as any;
