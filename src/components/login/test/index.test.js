import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Login from '../index';
import { Provider } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

jest.mock('../../store/authSlice', () => ({
  loginUser: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockStore = configureStore([]);

describe('login components', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        isAuthenticated: false,
        isLoading: false,
        error: null,
        message: '',
      },
    });
    store.dispatch = jest.fn();
  });

  test('render elements on screen', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    const loginEmail = screen.getByPlaceholderText('Email');
    expect(loginEmail).toBeInTheDocument();
    const loginPassword = screen.getByPlaceholderText('Password');
    expect(loginPassword).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /submit/i });
    expect(btn).toBeInTheDocument();
  });
  test('Show error when empty field submit', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    const btn = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(btn);
    const emailErr = screen.getByPlaceholderText('Email');
    expect(emailErr).toBeInTheDocument();
    const passwordErr = screen.getByPlaceholderText('Password');
    expect(passwordErr).toBeInTheDocument();
  });
  test('should update input value onChange', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'example123@gmail.com' } });
    expect(emailInput.value).toBe('example123@gmail.com');
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: '123456@Ag' } });
    expect(passwordInput.value).toBe('123456@Ag');
  });
  test('should dispatch loginUser on valid form details', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'exam123@gmail.com' } });
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: '123456@Ag' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        loginUser({
          email: 'exam123@gmail.com',
          password: '123456@Ag',
        })
      );
    });
  });
  test('show error when login failed', async () => {
    store = mockStore({
      auth: {
        isAuthenticated: false,
        error: 'Invalid Credentials',
      },
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid Credentials', {
        position: 'top-center',
        autoClose: 2000,
      });
    });
  });
  test('should disable the submit button when `isLoading` is true', () => {
    store = mockStore({
      auth: {
        isAuthenticated: false,
        isLoading: true,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });
});
