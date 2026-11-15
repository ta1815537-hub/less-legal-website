export const launchLessLegalApp = (targetScreen?: string) => {
  const schemeUrl = targetScreen ? `lesslegal://${targetScreen}` : 'lesslegal://home';
  window.location.href = schemeUrl;
  
  setTimeout(() => {
    // If not installed, fallback or show notice
  }, 1500);
};
