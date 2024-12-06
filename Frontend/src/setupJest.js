const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('React Router')) return;
  originalWarn(...args);
};

// Mock React Router future flags
window.__reactRouterConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};