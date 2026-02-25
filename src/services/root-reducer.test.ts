import { rootReducer } from './root-reducer';
import { ingredientsSlice } from './slices/ingredients-slice';
import { constructorSlice } from './slices/constructor-slice';
import { orderSlice } from './slices/order-slice';
import { userSlice } from './slices/user-slice';

describe('Тестирование rootReducer', () => {
  test('RootReducer инициирован undefined состоянием, unknown action', () => {
    // @ts-ignore: Action может быть неопределенным для этой проверки
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState.ingredients).toEqual(
      ingredientsSlice.getInitialState()
    );
    expect(initialState.burgerConstructor).toEqual(
      constructorSlice.getInitialState()
    );
    expect(initialState.order).toEqual(orderSlice.getInitialState());
    expect(initialState.user).toEqual(userSlice.getInitialState());
  });

  test('RootReducer сохраняет существующее состояние, unknown action', () => {
    const existingState = {
      user: {
        user: {
          email: 'user@gmail.com',
          name: 'testuser'
        },
        loading: false,
        error: null,
        isAuthChecked: true,
        isAuthenticated: true
      },
      ingredients: {
        ingredients: [
          {
            _id: '1',
            name: 'Тестовая булка',
            type: 'bun',
            proteins: 10,
            fat: 10,
            carbohydrates: 10,
            calories: 100,
            price: 100,
            image: 'img',
            image_mobile: 'img',
            image_large: 'img'
          }
        ],
        isIngredientsLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: [],
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      order: {
        orderData: null,
        orderNumber: null,
        loading: false,
        error: null,
        orders: [
          {
            _id: 'order-1',
            status: 'done',
            name: 'Тестовый бургер',
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
            number: 1,
            ingredients: ['1', '2']
          }
        ],
        total: 1,
        totalToday: 1,
        currentOrder: null
      }
    };

    const nextState = rootReducer(existingState, { type: 'UNKNOWN_ACTION' });
    expect(nextState).toEqual(existingState);
  });
});
