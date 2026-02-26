import {
  fetchIngredients,
  initialState,
  TIngredientsState
} from './ingredients-slice';
import { TIngredient } from '@utils-types';

// Тестовые данные
const bun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200igogo',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mainIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const sauceIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

// Импортируем редьюсер напрямую
import ingredientsSliceReducer from './ingredients-slice'; // Убедитесь, что экспорт default в ingredients-slice.ts

describe('Тесты редьюсеров слайса ингредиентов', () => {
  // Используем типизированное начальное состояние
  const getState = (): TIngredientsState => ({ ...initialState });

  test('При вызове экшена Request булевая переменная isIngredientsLoading меняется на true', () => {
    const stateBefore = getState();

    const nextState = ingredientsSliceReducer(
      stateBefore,
      fetchIngredients.pending('', undefined) // type, meta, payload
    );

    expect(nextState.ingredients).toEqual([]); // Данные не изменились
    expect(nextState.isIngredientsLoading).toBe(true); // Состояние загрузки включено
    expect(nextState.error).toBeNull(); // Ошибки нет
  });

  test('При вызове экшена Success данные записываются в стор и isIngredientsLoading меняется на false', () => {
    const stateBefore = getState();
    const testIngredients = [bun, mainIngredient, sauceIngredient];

    const nextState = ingredientsSliceReducer(
      stateBefore,
      fetchIngredients.fulfilled(testIngredients, '') // payload, type
    );

    expect(nextState.ingredients).toEqual(testIngredients); // Данные обновились
    expect(nextState.isIngredientsLoading).toBe(false); // Состояние загрузки выключено
    expect(nextState.error).toBeNull(); // Ошибки нет
  });

  test('При вызове экшена Failed ошибка записывается в стор и isIngredientsLoading меняется на false', () => {
    const stateBefore = getState();
    const errorMessage = 'Failed to load ingredients';

    const nextState = ingredientsSliceReducer(
      stateBefore,
      // @ts-ignore: payload может быть строкой или объектом ошибки
      fetchIngredients.rejected(new Error(errorMessage), '', errorMessage) // error, type, payload (rejectValue)
    );

    expect(nextState.ingredients).toEqual([]); // Данные не изменились
    expect(nextState.isIngredientsLoading).toBe(false); // Состояние загрузки выключено
    // Проверяем, что ошибка записалась. В slices.txt используется typeof payload === 'string'
    expect(nextState.error).toBe(errorMessage); // или 'Failed to load ingredients' если payload был строкой
  });
});
