import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely decode and parse URI-encoded JSON data
 * @param encodedData - The URI-encoded JSON string
 * @param fallbackValue - Value to return if parsing fails
 * @returns Parsed object or fallback value
 */
export function safeDecodeJSON<T = any>(encodedData: string | null, fallbackValue: T = {} as T): T {
  if (!encodedData) {
    return fallbackValue
  }

  try {
    // First try standard decoding
    return JSON.parse(decodeURIComponent(encodedData))
  } catch (decodeError) {
    console.warn('Failed to decode URI component, trying direct JSON parse:', decodeError)
    try {
      // Fallback to direct JSON parsing
      return JSON.parse(encodedData)
    } catch (parseError) {
      console.error('Failed to parse JSON data:', parseError)
      return fallbackValue
    }
  }
} 