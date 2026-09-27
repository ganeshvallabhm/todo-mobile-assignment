/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import { formatDisplayDateTime } from '../src/utils/date';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

test('formats task date-time in the required display pattern', () => {
  expect(formatDisplayDateTime('2026-09-27T21:30:00.000Z')).toBe('27 Sep 2026, 9:30 PM');
});
