import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { toast } from 'react-toastify';
import Registration from '../index';
import { registerUser } from '../../store/authSlice';

jest.mock('../../store/authSlice', () => ({
  registerUser: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockStore = configureStore([]);

describe('Registration Component', () => {
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

  it('should render the registration form correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Registration />
        </MemoryRouter>
      </Provider>
    );
    const name = screen.getByPlaceholderText('Full Name');
    expect(name).toBeInTheDocument();
    const email = screen.getByPlaceholderText('Email');
    expect(email).toBeInTheDocument();
    const phone = screen.getByPlaceholderText('Phone No.');
    expect(phone).toBeInTheDocument();
    const password = screen.getByPlaceholderText('Password');
    expect(password).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: 'Sign Up' });
    expect(btn).toBeInTheDocument();
  });
  it('should show error messages for invalid inputs', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Registration />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Phone number is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('should update input values on change', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Registration />
        </MemoryRouter>
      </Provider>
    );

    const nameInput = screen.getByPlaceholderText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'exam123@gmail.com' } });
    expect(emailInput.value).toBe('exam123@gmail.com');
    const phoneInput = screen.getByPlaceholderText('Phone No.');
    fireEvent.change(phoneInput, { target: { value: '6397212119' } });
    expect(phoneInput.value).toBe('6397212119');
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: '123456@Ag' } });
    expect(passwordInput.value).toBe('123456@Ag');
  });

  it('should dispatch registerUser on valid form submission', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Registration />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Phone No.'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Pass@123' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        registerUser({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          password: 'Pass@123',
        })
      );
    });
  });

  it('should show an error toast when registration fails', async () => {
    store = mockStore({
      auth: {
        isAuthenticated: false,
        error: 'User already exists',
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Registration />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('User already exists', {
        position: 'top-center',
        autoClose: 2000,
      });
    });
  });

  it('should disable the submit button when `isLoading` is true', () => {
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
          <Registration />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('button', { name: /signing up/i })).toBeDisabled();
  });
});
