import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Spotify Covers title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Spotify Covers/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders search input', () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/Research an artist/i);
  expect(searchInput).toBeInTheDocument();
});


test('renders GitHub link in footer', () => {
  render(<App />);
  const githubLink = screen.getByText(/View on GitHub/i);
  expect(githubLink).toBeInTheDocument();
  expect(githubLink).toHaveAttribute('href', 'https://github.com/cyrilnapo/spotifycovers');
});
