# Testing Guide for Movie Search App

This guide explains how to write and run tests for the Movie Search App using **Vitest** and **React Testing Library**.

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests once
npm run test:run

# Run tests in watch mode (interactive)
npm run test

# Run tests with UI interface
npm run test:ui
```

## 📚 Testing Stack

- **Vitest**: Fast test runner with native Vite integration
- **React Testing Library**: Industry standard for testing React components
- **jsdom**: DOM simulation for Node.js environment
- **@testing-library/jest-dom**: Custom matchers for DOM testing

## 🧪 Test Structure

```
src/
├── test/
│   ├── setup.ts              # Global test setup
│   └── test-utils.tsx        # Custom render function with providers
├── Components/
│   └── __tests__/
│       └── MovieCard.test.tsx
├── Hooks/
│   └── __tests__/
│       └── useDebounce.test.tsx
└── pages/
    └── __tests__/
        └── Home.test.tsx
```

## 📝 Writing Tests

### 1. Component Tests

Components are tested using React Testing Library, which focuses on testing behavior from a user's perspective.

```tsx
import { render, screen, fireEvent } from '../test/test-utils'
import { describe, it, expect } from 'vitest'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('responds to user interactions', async () => {
    render(<MyComponent />)
    const button = screen.getByRole('button')
    
    await act(async () => {
      fireEvent.click(button)
    })
    
    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })
})
```

### 2. Hook Tests

Custom hooks are tested using `renderHook`:

```tsx
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import useMyHook from '../useMyHook'

describe('useMyHook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useMyHook())
    expect(result.current.value).toBe(0)
  })

  it('updates state correctly', () => {
    const { result } = renderHook(() => useMyHook())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.value).toBe(1)
  })
})
```

### 3. API Mocking

Mock external dependencies to control test behavior:

```tsx
// Mock the API module
vi.mock('../api/movies', () => ({
  searhMovies: vi.fn(),
}))

// In your test
const { searhMovies } = await import('../api/movies')
vi.mocked(searhMovies).mockResolvedValue(mockData)
```

### 4. Async Testing

Handle asynchronous operations with `waitFor`:

```tsx
it('shows loading state', async () => {
  render(<MyComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  }, { timeout: 1000 })
})
```

## 🎯 Testing Patterns

### 1. User-Centric Testing

Focus on what users see and do:

```tsx
// ✅ Good - Tests user behavior
it('shows error when search fails', async () => {
  render(<SearchComponent />)
  const input = screen.getByRole('textbox')
  
  await act(async () => {
    fireEvent.change(input, { target: { value: 'test' } })
  })
  
  await waitFor(() => {
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })
})

// ❌ Avoid - Tests implementation details
it('calls setState when input changes', () => {
  // Don't test internal state management
})
```

### 2. Accessibility Testing

Test for accessibility features:

```tsx
it('has proper accessibility attributes', () => {
  render(<MyComponent />)
  
  const button = screen.getByRole('button')
  expect(button).toHaveAttribute('aria-label', 'Search')
  expect(button).not.toBeDisabled()
})
```

### 3. Error Boundary Testing

Test error scenarios:

```tsx
it('handles API errors gracefully', async () => {
  vi.mocked(apiCall).mockRejectedValue(new Error('Network error'))
  
  render(<MyComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })
})
```

## 🔧 Test Utilities

### Custom Render Function

Use the custom render function from `test-utils.tsx` to automatically wrap components with providers:

```tsx
import { render, screen } from '../test/test-utils'

// Automatically includes Redux, React Query, and Router providers
render(<MyComponent />)
```

### Common Assertions

```tsx
// Element presence
expect(screen.getByText('Hello')).toBeInTheDocument()
expect(screen.queryByText('Error')).not.toBeInTheDocument()

// Element attributes
expect(button).toHaveAttribute('disabled')
expect(input).toHaveValue('test')

// CSS classes
expect(element).toHaveClass('active', 'highlighted')

// Form interactions
expect(screen.getByRole('button')).toBeEnabled()
expect(screen.getByRole('textbox')).toHaveFocus()
```

## 🚨 Common Pitfalls

### 1. Not Wrapping State Updates in `act()`

```tsx
// ❌ Wrong
fireEvent.click(button)
expect(screen.getByText('Updated')).toBeInTheDocument()

// ✅ Correct
await act(async () => {
  fireEvent.click(button)
})
expect(screen.getByText('Updated')).toBeInTheDocument()
```

### 2. Testing Implementation Details

```tsx
// ❌ Don't test internal state
expect(component.state.count).toBe(1)

// ✅ Test what users see
expect(screen.getByText('Count: 1')).toBeInTheDocument()
```

### 3. Not Waiting for Async Operations

```tsx
// ❌ Wrong
fireEvent.click(button)
expect(screen.getByText('Loaded')).toBeInTheDocument()

// ✅ Correct
fireEvent.click(button)
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

## 📊 Test Coverage

To check test coverage, add this to your `vite.config.ts`:

```ts
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
  },
}
```

Then run:
```bash
npm run test:run -- --coverage
```

## 🎯 Best Practices

1. **Test behavior, not implementation**
2. **Use semantic queries** (`getByRole`, `getByLabelText`)
3. **Write tests that resemble user interactions**
4. **Keep tests focused and isolated**
5. **Use descriptive test names**
6. **Mock external dependencies**
7. **Test error scenarios**
8. **Use `data-testid` sparingly**

## 🔍 Debugging Tests

### Using `screen.debug()`

```tsx
it('debug example', () => {
  render(<MyComponent />)
  screen.debug() // Shows the rendered HTML
})
```

### Using `screen.logTestingPlaygroundURL()`

```tsx
it('playground example', () => {
  render(<MyComponent />)
  screen.logTestingPlaygroundURL() // Opens testing playground
})
```

## 📚 Additional Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [React Testing Examples](https://github.com/testing-library/react-testing-library#examples)

## 🎉 Congratulations!

You now have a comprehensive testing setup for your React application! The tests will help you:

- Catch bugs early
- Refactor with confidence
- Document component behavior
- Improve code quality
- Speed up development

Happy testing! 🚀 