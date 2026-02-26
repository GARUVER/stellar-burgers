import {
  registerUser,
  loginUser,
  fetchUser,
  updateUser,
  logoutUser,
  initialState,
  TUserState
} from './user-slice';
import { TUser } from '@utils-types';
import { TLoginData, TRegisterData } from '@api';
import { userSlice } from './user-slice';

const userMock: TUser = {
  email: 'user@gmail.com',
  name: 'testuser'
};

const authResponseMock = {
  success: true,
  user: userMock,
  accessToken: 'accessToken',
  refreshToken: 'refreshToken'
};

const registerData: TRegisterData = {
  email: 'user@gmail.com',
  password: 'password',
  name: 'testuser'
};

const loginData: TLoginData = {
  email: 'user@gmail.com',
  password: 'password'
};

const updatedUserData = {
  name: 'updatedName'
};

const updatedUserResponse = {
  ...userMock,
  name: 'updatedName'
};

describe('Тесты редьюсеров слайса user (userSlice)', () => {
  const getState = (): TUserState => ({ ...initialState });

  test('registerUser.pending: изменение состояния загрузки и сброс ошибки', () => {
    const stateBefore = getState();

    const nextState = userSlice.reducer(
      stateBefore,
      registerUser.pending('', registerData)
    );

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
    expect(nextState.user).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.isAuthChecked).toBe(false);
  });

  test('registerUser.fulfilled: сохранение данных пользователя, установка isAuthenticated и isAuthChecked', () => {
    const stateBefore = getState();

    const nextState = userSlice.reducer(
      stateBefore,
      registerUser.fulfilled(authResponseMock, '', registerData)
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.user).toEqual(userMock);
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.isAuthChecked).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('registerUser.rejected: сохранение ошибки и установка isAuthChecked', () => {
    const stateBefore = getState();
    const errorMessage = 'Registration failed';

    const nextState = userSlice.reducer(
      stateBefore,
      registerUser.rejected(
        new Error(errorMessage),
        '',
        registerData,
        errorMessage
      )
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
    expect(nextState.isAuthChecked).toBe(true);
    expect(nextState.user).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
  });

  test('loginUser.pending: изменение состояния загрузки и сброс ошибки', () => {
    const stateBefore = getState();

    const nextState = userSlice.reducer(
      stateBefore,
      loginUser.pending('', loginData)
    );

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
    expect(nextState.user).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.isAuthChecked).toBe(false);
  });

  test('loginUser.fulfilled: сохранение данных пользователя, установка isAuthenticated и isAuthChecked', () => {
    const stateBefore = getState();

    const nextState = userSlice.reducer(
      stateBefore,
      loginUser.fulfilled(authResponseMock, '', loginData)
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.user).toEqual(userMock);
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.isAuthChecked).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('loginUser.rejected: сохранение ошибки и установка isAuthChecked', () => {
    const stateBefore = getState();
    const errorMessage = 'Login failed';

    const nextState = userSlice.reducer(
      stateBefore,
      loginUser.rejected(new Error(errorMessage), '', loginData, errorMessage)
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
    expect(nextState.isAuthChecked).toBe(true);
    expect(nextState.user).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
  });

  test('fetchUser.pending: изменение состояния загрузки и сброс ошибки', () => {
    const stateBefore = getState();

    const nextState = userSlice.reducer(
      stateBefore,
      fetchUser.pending('', undefined)
    );

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
    expect(nextState.user).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.isAuthChecked).toBe(false);
  });

  test('fetchUser.fulfilled: сохранение данных пользователя, установка isAuthenticated и isAuthChecked', () => {
    const stateBefore = getState();

    const nextState = userSlice.reducer(
      stateBefore,
      fetchUser.fulfilled(userMock, '')
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.user).toEqual(userMock);
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.isAuthChecked).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('fetchUser.rejected: сохранение ошибки и установка isAuthChecked', () => {
    const stateBefore = getState();
    const errorMessage = 'Failed to fetch user';

    const nextState = userSlice.reducer(
      stateBefore,
      fetchUser.rejected(new Error(errorMessage), '', undefined, errorMessage)
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
    expect(nextState.isAuthChecked).toBe(true);
    expect(nextState.user).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
  });

  test('updateUser.fulfilled: обновление данных пользователя', () => {
    const stateBefore: TUserState = {
      ...initialState,
      user: userMock,
      isAuthenticated: true,
      isAuthChecked: true
    };

    const nextState = userSlice.reducer(
      stateBefore,
      updateUser.fulfilled(updatedUserResponse, '', updatedUserData)
    );

    expect(nextState.user).toEqual(updatedUserResponse);
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.isAuthChecked).toBe(true);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
  });

  test('logoutUser.fulfilled: сброс данных пользователя и isAuthenticated, установка isAuthChecked', () => {
    const stateBefore: TUserState = {
      ...initialState,
      user: userMock,
      isAuthenticated: true,
      isAuthChecked: true
    };

    const nextState = userSlice.reducer(
      stateBefore,
      logoutUser.fulfilled(undefined, '')
    );

    expect(nextState.user).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.isAuthChecked).toBe(true);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
  });

  test('logoutUser.rejected: сохранение ошибки и установка isAuthChecked', () => {
    const stateBefore: TUserState = {
      ...initialState,
      user: userMock,
      isAuthenticated: true,
      isAuthChecked: true
    };
    const errorMessage = 'Logout failed';

    const nextState = userSlice.reducer(
      stateBefore,
      logoutUser.rejected(new Error(errorMessage), '', undefined, errorMessage)
    );

    expect(nextState.error).toBe(errorMessage);
    expect(nextState.isAuthChecked).toBe(true);
    expect(nextState.user).toEqual(userMock);
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.loading).toBe(false);
  });
});
