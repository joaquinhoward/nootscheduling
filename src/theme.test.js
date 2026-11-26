import { describe, it, expect } from 'vitest'
import { resolveTheme } from './theme.js'

describe('resolveTheme', () => {
  it('uses the saved choice when there is one', () => {
    expect(resolveTheme('dark', false)).toBe('dark')
    expect(resolveTheme('light', true)).toBe('light')
  })

  it('follows the system setting when nothing valid is saved', () => {
    expect(resolveTheme(null, true)).toBe('dark')
    expect(resolveTheme(null, false)).toBe('light')
    expect(resolveTheme('purple', true)).toBe('dark')
  })
})
