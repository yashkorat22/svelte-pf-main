import { describe, it, expect, test } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import App from './App.svelte'

test('renders Hello world!', () => {
  render(App)
  expect(screen.getByText('Automations')).toBeTruthy()
})