import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Home from '../index.js';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { logoutUser } from '../../store/authSlice';

const mockStore = configureStore([]);

jest.mock('../../store/authSlice', () => ({
  logoutUser: jest.fn(),
}));

describe('Home components', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      auth: {
        isAuthenticated: false,
        user: { name: '', email: '', phone: '' },
      },
    });

    store.dispatch = jest.fn();
    jest.spyOn(localStorage, 'removeItem');
  });

  it('should display user when authenticated', () => {
    store = mockStore({
      auth: {
        isAuthenticated: true,
        user: {
          name: 'amit',
          email: 'amgiri1010@gmail.com',
          phone: '6397212119',
        },
      },
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole('heading', { name: /welcome, amit/i })
    ).toBeInTheDocument();
    expect(screen.getByText('amgiri1010@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('6397212119')).toBeInTheDocument();
  });
  it('should dispatch logoutUser and remove localStorage item on logout click', async () => {
    store = mockStore({
      auth: {
        isAuthenticated: true,
        user: {
          name: 'amit',
          email: 'amgiri1010@gmail.com',
          phone: '6397212119',
        },
      },
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );
    const btn = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(logoutUser());
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith('loginUser');
  });
});
