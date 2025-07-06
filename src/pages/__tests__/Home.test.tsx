import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Home from '../Home'
import { store } from '../../store'

// Mock the API module
vi.mock('../../api/movies', () => ({
  searhMovies: vi.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Create a wrapper component for providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  )
}

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('renders the search input and title', () => {
    render(<Home />, { wrapper: createWrapper() })
    
    expect(screen.getByText(/Movies Search/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('focuses the input on mount', () => {
    render(<Home />, { wrapper: createWrapper() })
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveFocus()
  })

  it('updates input value when user types', async () => {
    render(<Home />, { wrapper: createWrapper() })
    
    const input = screen.getByRole('textbox')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'batman' } })
    })
    
    expect(input).toHaveValue('batman')
  })

  it('loads query from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue('saved query')
    
    render(<Home />, { wrapper: createWrapper() })
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('saved query')
  })

  it('saves query to localStorage when input changes', async () => {
    render(<Home />, { wrapper: createWrapper() })
    
    const input = screen.getByRole('textbox')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'new query' } })
    })
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('inputQuery', 'new query')
    })
  })

  it('shows loading state when searching', async () => {
    const { searhMovies } = await import('../../api/movies')
    vi.mocked(searhMovies).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve([]), 100))
    )

    render(<Home />, { wrapper: createWrapper() })
    
    const input = screen.getByRole('textbox')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'batman' } })
    })
    
    // Wait for debounce
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    }, { timeout: 500 })
  })

  it('shows error message when API fails', async () => {
    const { searhMovies } = await import('../../api/movies')
    vi.mocked(searhMovies).mockRejectedValue(new Error('API Error'))

    render(<Home />, { wrapper: createWrapper() })
    
    const input = screen.getByRole('textbox')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'batman' } })
    })
    
    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument()
    }, { timeout: 500 })
  })

  it('shows "No movies found" when search returns empty results', async () => {
    const { searhMovies } = await import('../../api/movies')
    vi.mocked(searhMovies).mockResolvedValue([])

    render(<Home />, { wrapper: createWrapper() })
    
    const input = screen.getByRole('textbox')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'nonexistent' } })
    })
    
    await waitFor(() => {
      expect(screen.getByText('No movies found')).toBeInTheDocument()
    }, { timeout: 500 })
  })

  it('does not trigger search for queries less than 3 characters', async () => {
    const { searhMovies } = await import('../../api/movies')
    
    render(<Home />, { wrapper: createWrapper() })
    
    const input = screen.getByRole('textbox')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'ab' } })
    })
    
    // Wait longer than debounce time
    await new Promise(resolve => setTimeout(resolve, 500))
    
    expect(searhMovies).not.toHaveBeenCalled()
  })

  it('displays movies when search returns results', async () => {
    const { searhMovies } = await import('../../api/movies')
    const mockMovies = [
      {
        imdbID: '1',
        Title: 'Batman Begins',
        Type: 'movie',
        Year: '2005',
        Poster: 'batman-poster.jpg'
      },
      {
        imdbID: '2',
        Title: 'The Dark Knight',
        Type: 'movie',
        Year: '2008',
        Poster: 'dark-knight-poster.jpg'
      }
    ]
    vi.mocked(searhMovies).mockResolvedValue(mockMovies)

    render(<Home />, { wrapper: createWrapper() })
    
    const input = screen.getByRole('textbox')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'batman' } })
    })
    
    await waitFor(() => {
      expect(screen.getByText('Batman Begins')).toBeInTheDocument()
      expect(screen.getByText('The Dark Knight')).toBeInTheDocument()
    }, { timeout: 500 })
  })

  it('has correct CSS classes for styling', () => {
    render(<Home />, { wrapper: createWrapper() })
    
    const container = screen.getByText(/Movies Search/i).closest('div')
    expect(container).toHaveClass('max-w-3xl', 'mx-auto', 'p-4')
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('w-full', 'border', 'rounded', 'shadow', 'p-3', 'mb-6')
  })
})
