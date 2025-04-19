## Directory Structure
```
src/
├── actions/      # Redux actions
├── assets/       # Static assets (images, fonts)
├── components/   # Reusable UI components
├── config/       # Configuration files
├── reducers/     # Redux reducers
├── screens/      # Screen components
└── utils/        # Utility functions
```

## Key Development Guidelines

1. **Architecture**
   - Follow screen-based component organization
   - Keep business logic in Redux actions/reducers
   - Use reusable components for common UI elements
   - Maintain clear separation between screens and components

2. **State Management**
   - Use Redux for global state (auth, athlete data)
   - Implement Redux Toolkit and slice pattern
   - Use local state (useState) for UI-specific state
   - Clean up subscriptions and effects properly

3. **Component Design**
   - Create modular, reusable components
   - Use StyleSheet.create for styles
   - Implement responsive layouts using Dimensions
   - Document component props and requirements

4. **API Integration**
   - Centralize API configuration in config/api.js
   - Use axios with consistent error handling
   - Implement loading and error states
   - Handle token management and auth

5. **Navigation**
   - Use React Navigation for routing
   - Implement proper stack/tab navigation
   - Handle deep linking appropriately
   - Maintain navigation state

6. **Styling**
   - Use consistent color scheme and spacing
   - Implement responsive design patterns
   - Follow platform-specific guidelines
   - Support dark/light themes

7. **Error Handling**
   - Display user-friendly error messages
   - Implement error boundaries
   - Log errors appropriately
   - Provide recovery options

8. **Testing**
   - Write component unit tests
   - Test navigation flows
   - Mock API calls and Redux state
   - Test error scenarios

9. **Performance**
   - Optimize list rendering
   - Implement proper memoization
   - Handle image loading efficiently
   - Monitor and optimize bundle size

10. **Security**
    - Secure sensitive data storage
    - Validate all inputs
    - Handle authentication securely
    - Implement proper logout cleanup 