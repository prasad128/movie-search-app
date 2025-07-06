import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useDebounce from '../useDebounce'

describe('useDebounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    
    expect(result.current).toBe('initial')
  })

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )

    // Change value
    rerender({ value: 'changed' })
    expect(result.current).toBe('initial') // Should still be initial

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('changed') // Now should be updated
  })

  it('cancels previous timeout when value changes quickly', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )

    // Change value multiple times quickly
    rerender({ value: 'first' })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender({ value: 'second' })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender({ value: 'final' })
    
    // Should still be initial
    expect(result.current).toBe('initial')

    // Advance to trigger the final value
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('final') // Should be the last value, not intermediate ones
  })

  it('works with different data types', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 0 } }
    )

    expect(result.current).toBe(0)

    rerender({ value: 42 })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe(42)
  })

  it('works with objects', () => {
    const initialObj = { name: 'John', age: 25 }
    const newObj = { name: 'Jane', age: 30 }

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: initialObj } }
    )

    expect(result.current).toEqual(initialObj)

    rerender({ value: newObj })
    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(result.current).toEqual(newObj)
  })

  it('uses default delay of 500ms when not specified', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'changed' })
    
    // Should not have updated yet
    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Now should be updated
    expect(result.current).toBe('changed')
  })

  it('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
    
    const { unmount } = renderHook(() => useDebounce('test', 1000))
    
    unmount()
    
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
}) 