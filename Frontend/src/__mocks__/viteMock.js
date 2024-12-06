const viteMock = {
    import: {
      meta: {
        env: {
          MODE: 'test',
          PROD: true,
          DEV: false,
          VITE_API_URI: 'http://localhost:9000/api/v1'  // Add your API URL here
        }
      }
    }
  };
  
  globalThis.import = viteMock.import;

