import { describe, it, expect } from 'vitest'
import { formatTime } from './formatters'

describe('formatTime', () => {
  it('formats zero', () => expect(formatTime(0)).toBe('0:00'))
  it('formats seconds under a minute', () => expect(formatTime(45)).toBe('0:45'))
  it('formats exactly one minute', () => expect(formatTime(60)).toBe('1:00'))
  it('formats minutes and seconds', () => expect(formatTime(75)).toBe('1:15'))
  it('pads single-digit seconds', () => expect(formatTime(61)).toBe('1:01'))
  it('formats over one hour', () => expect(formatTime(3661)).toBe('61:01'))
  it('handles NaN', () => expect(formatTime(NaN)).toBe('0:00'))
  it('handles Infinity', () => expect(formatTime(Infinity)).toBe('0:00'))
  it('handles negative', () => expect(formatTime(-5)).toBe('0:00'))
})
