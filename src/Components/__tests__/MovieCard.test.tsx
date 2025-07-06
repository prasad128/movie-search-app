import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import MovieCard from '../MovieCard'
import type { MovieType } from '../../pages/Home'

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

describe('MovieCard Component', () => {
  const mockMovie: MovieType = {
    imdbID: 'tt0468569',
    Title: 'The Dark Knight',
    Type: 'movie',
    Year: '2008',
    Poster: 'https://example.com/dark-knight.jpg'
  }

  it('renders movie information correctly', () => {
    render(<MovieCard movie={mockMovie} />, { wrapper: createWrapper() })
    
    expect(screen.getByText('The Dark Knight')).toBeInTheDocument()
    expect(screen.getByText('2008')).toBeInTheDocument()
    expect(screen.getByAltText('The Dark Knight')).toBeInTheDocument()
  })

  it('displays the movie poster when available', () => {
    render(<MovieCard movie={mockMovie} />, { wrapper: createWrapper() })
    
    const image = screen.getByAltText('The Dark Knight')
    expect(image).toHaveAttribute('src', 'https://example.com/dark-knight.jpg')
  })

  it('displays placeholder image when poster is N/A', () => {
    const movieWithoutPoster: MovieType = {
      ...mockMovie,
      Poster: 'N/A'
    }
    
    render(<MovieCard movie={movieWithoutPoster} />, { wrapper: createWrapper() })
    
    const image = screen.getByAltText('The Dark Knight')
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/200x300?text=No+Image')
  })

  it('links to the correct movie detail page', () => {
    render(<MovieCard movie={mockMovie} />, { wrapper: createWrapper() })
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/movie/tt0468569')
  })

  it('has correct CSS classes for styling', () => {
    render(<MovieCard movie={mockMovie} />, { wrapper: createWrapper() })
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass('border', 'rounded', 'shadow', 'p-4', 'flex', 'flex-col', 'items-center', 'text-center')
    
    const image = screen.getByAltText('The Dark Knight')
    expect(image).toHaveClass('w-full', 'h-72', 'object-cover', 'mb-4')
    
    const title = screen.getByText('The Dark Knight')
    expect(title).toHaveClass('font-semibold', 'text-lg')
    
    const year = screen.getByText('2008')
    expect(year).toHaveClass('text-gray-500')
  })

  it('renders with different movie data', () => {
    const differentMovie: MovieType = {
      imdbID: 'tt0372784',
      Title: 'Batman Begins',
      Type: 'movie',
      Year: '2005',
      Poster: 'https://example.com/batman-begins.jpg'
    }
    
    render(<MovieCard movie={differentMovie} />, { wrapper: createWrapper() })
    
    expect(screen.getByText('Batman Begins')).toBeInTheDocument()
    expect(screen.getByText('2005')).toBeInTheDocument()
    expect(screen.getByAltText('Batman Begins')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/movie/tt0372784')
  })
}) 