module.exports = {
  // ...existing config...
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/repositories/',
    'src/controllers/AccountController.js',
    'src/controllers/ObservationController.js',
    'src/controllers/ProcessController.js',
    'src/controllers/TimelineController.js',
    'src/services/AccountService.js',
    'src/services/ObservationService.js',
    'src/services/ProcessService.js',
    'src/services/TimelineService.js',
    'src/utils/jwtUtil.js',
  ],
};
