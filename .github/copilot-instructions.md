# Elo Sport Competition Mobile App Style Guide and Architecture

## Project Overview
Elo Sport Competition Mobile App is a React Native application that provides a mobile interface for managing athletic competitions, bout tracking, and athlete rankings. The application follows React Native best practices with a focus on component reusability and state management.

## Architecture

### Directory Structure
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

### Layer Responsibilities

1. **Screens Layer** (`screens/`)
   - Main UI containers
   - Screen-specific logic
   - Navigation handling
   - Example: `LoginScreen`, `ChallengeScreen`

2. **Components Layer** (`components/`)
   - Reusable UI elements
   - Presentational components
   - Component-specific styles
   - Example: Custom buttons, form inputs

3. **Redux Layer** (`actions/`, `reducers/`)
   - State management
   - Action creators
   - Reducers
   - Example: `athleteSlice` for athlete data

4. **Configuration Layer** (`config/`)
   - Environment configuration
   - API endpoints
   - Constants
   - Example: `api.js` for API base URL

5. **Assets** (`assets/`)
   - Images
   - Icons
   - Fonts
   - Example: `Placeholder.png`

## State Management

### Redux Implementation
- Uses Redux for global state management
- Implements Redux Toolkit for modern Redux
- Follows slice pattern for reducer organization
- Maintains athlete session state

### Local State Management
- Uses React hooks (`useState`, `useEffect`)
- Implements `useFocusEffect` for screen focus
- Manages form state locally
- Handles UI state (loading, error states)

## API Integration

### API Configuration
- Centralized API configuration in `config/api.js`
- Environment-based URL configuration
- Uses axios for HTTP requests
- Consistent error handling

### Request Patterns
```javascript
// Example API call pattern
const fetchData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/endpoint`);
    handleSuccess(response.data);
  } catch (error) {
    console.error("Error:", error);
    handleError(error);
  }
};
```

## Component Design

### Screen Components
- Consistent layout structure
- Responsive design using Dimensions
- Screen-specific styles
- Clear separation of concerns

### Reusable Components
- Modular design
- Props documentation
- Style customization props
- Consistent naming conventions

## Styling Conventions

### StyleSheet Implementation
```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});
```

### Responsive Design
- Uses Dimensions API
- Flexible layouts
- Percentage-based sizing
- Device-agnostic styling

### Color Scheme
- Primary colors: Black, White
- Accent colors: Based on action type
- Consistent color usage
- Semantic color naming

## Navigation

### React Navigation
- Stack navigation for main flow
- Tab navigation for main sections
- Screen params documentation
- Consistent navigation patterns

## Form Handling

### Input Components
- Consistent styling
- Error handling
- Validation
- Accessibility support

### Validation Patterns
- Client-side validation
- Error message display
- Form state management
- Submit handling

## Error Handling

### API Errors
- Consistent error messages
- User-friendly displays
- Error logging
- Recovery options

### UI Error States
- Loading states
- Error boundaries
- Fallback UI
- Retry mechanisms

## Testing Guidelines

### Component Testing
- Unit tests for components
- Integration tests
- Navigation testing
- State management testing

### Test Organization
- Test files alongside components
- Consistent naming pattern
- Mock data organization
- Test utilities

## Performance Considerations

### Optimization Techniques
- Memoization
- Lazy loading
- Image optimization
- List virtualization

### State Updates
- Efficient state updates
- Batch updates
- Prevent unnecessary renders
- Performance monitoring

## Development Workflow

### Version Control
- Feature branches
- Meaningful commits
- Pull request guidelines
- Version tagging

### Code Review
- Style guide compliance
- Performance review
- Security review
- Testing requirements

## Dependencies

### Core Dependencies
- react-native
- @react-navigation
- redux/redux-toolkit
- axios
- react-native-gesture-handler

### Development Dependencies
- Testing libraries
- Development tools
- Type checking
- Linting

## Best Practices

### Code Organization
1. Group related functionality
2. Maintain clear component hierarchy
3. Follow single responsibility
4. Keep components focused

### State Management
1. Appropriate state location
2. Efficient updates
3. Clear state flow
4. Proper cleanup

### Performance
1. Optimize renders
2. Handle large lists
3. Asset optimization
4. Memory management

### Security
1. Input validation
2. Secure storage
3. API security
4. Authentication handling

## AI Development Guidelines

When extending this project, AI assistants should:

1. **Follow Architecture**
   - Maintain directory structure
   - Use appropriate layers
   - Follow state management patterns
   - Implement proper navigation

2. **Component Development**
   - Create reusable components
   - Follow styling conventions
   - Implement proper validation
   - Add error handling

3. **State Management**
   - Use Redux appropriately
   - Manage local state
   - Handle side effects
   - Clean up resources

4. **API Integration**
   - Follow API patterns
   - Handle errors consistently
   - Use configuration
   - Implement loading states

5. **Testing**
   - Add component tests
   - Test error cases
   - Mock external dependencies
   - Verify navigation

6. **Documentation**
   - Document components
   - Explain complex logic
   - Update README
   - Add inline comments

7. **Performance**
   - Optimize rendering
   - Handle large data sets
   - Manage resources
   - Monitor performance

8. **Security**
   - Validate inputs
   - Secure data storage
   - Handle authentication
   - Protect sensitive data 