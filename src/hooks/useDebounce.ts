import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {                   //reacts whenever value or delay changes to start a timer every time the input changes.
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)   //component unmounts
    }
  }, [value, delay])

  return debouncedValue
}