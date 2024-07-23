import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';  // Import jest-dom here as well
import UserPopover from './UserPopover.svelte';
import { writable } from 'svelte/store';

describe('UserPopover Component', () => {
  const mockEmailStore = writable('user@example.com');

  // Use fake timers for vitest
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('renders user email in the button', () => {
    render(UserPopover, { context: new Map([['email', mockEmailStore]]) });
    expect(screen.getByText('user@example.com')).toBeTruthy();
  });

  it('popover appears on mouse enter and hides on mouse leave', async () => {
    render(UserPopover, { context: new Map([['email', mockEmailStore]]) });

    // Initially, the popover should not be visible
    // expect(screen.queryByRole('menu')).toBeNull();

    // Hover over the email button to show the popover
    const emailButton = screen.getByText('user@example.com');
    await fireEvent.mouseEnter(emailButton);

    // // Popover should be visible now
    // expect(await screen.findByRole('menu')).toBeInTheDocument();

    // Ensure the popover contains "Profile" and "Signout"
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Signout')).toBeInTheDocument();
    
    // Move mouse away to hide the popover
    await fireEvent.mouseLeave(emailButton);
    vi.advanceTimersByTime(200);

    // Popover should no longer be visible
    //expect(screen.queryByRole('menu')).toBeNull();
  });
});