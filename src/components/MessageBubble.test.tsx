import { render, screen } from '@testing-library/react';
import MessageBubble from './MessageBubble';
import { describe, it, expect } from 'vitest';

describe('MessageBubble', () => {
  it('renders user message correctly', () => {
    render(<MessageBubble role="user" content="Hello AI" timestamp={Date.now()} />);
    expect(screen.getByText('Hello AI')).toBeInTheDocument();
  });

  it('renders assistant message correctly', () => {
    render(<MessageBubble role="assistant" content="Hello User" timestamp={Date.now()} />);
    expect(screen.getByText('Hello User')).toBeInTheDocument();
  });
});
