import {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState,
  TConstructorState
} from './constructor-slice';
import { constructorSlice } from './constructor-slice';
import { TIngredient } from '@utils-types';

interface TConstructorIngredient extends TIngredient {
  id: string;
}

// Константы с данными ингредиентов
const BUN: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
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

const MAIN_INGREDIENT: TIngredient = {
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

const SAUCE_INGREDIENT: TIngredient = {
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

// Константы для ID ингредиентов в конструкторе
const CONSTRUCTOR_INGREDIENTS = {
  BUN_ID: 'bun_id',
  MAIN_ID_1: 'id1',
  MAIN_ID_2: 'id2',
  MAIN_ID_3: 'id3',
  NON_EXISTENT_ID: 'nonexistent-id'
} as const;

// Вспомогательная функция для создания состояния с ингредиентами
const createStateWithIngredients = (
  ingredients: Array<Partial<TConstructorIngredient>> = []
): TConstructorState => ({
  ...initialState,
  ingredients: ingredients as TConstructorIngredient[]
});

// Вспомогательная функция для создания состояния с булкой и начинками
const createStateWithBunAndIngredients = (
  bunId: string = CONSTRUCTOR_INGREDIENTS.BUN_ID,
  ingredients: Array<Partial<TConstructorIngredient>> = []
): TConstructorState => ({
  ...initialState,
  bun: { id: bunId, ...BUN } as TConstructorIngredient,
  ingredients: ingredients as TConstructorIngredient[]
});

const getState = (): TConstructorState => ({ ...initialState });

describe('Тесты редьюсера конструктора бургера', () => {
  test('Добавление ингредиента (начинки)', () => {
    const stateBefore = getState();
    const action = addIngredient(MAIN_INGREDIENT);
    const preparedPayload: TConstructorIngredient = action.payload;
    expect(preparedPayload.id).toBeDefined();
    expect(preparedPayload._id).toBe(MAIN_INGREDIENT._id);

    const stateAfter = reducer(stateBefore, action);
    expect(stateAfter.bun).toBeNull();
    expect(stateAfter.ingredients).toHaveLength(1);
    expect(stateAfter.ingredients[0]).toEqual(preparedPayload);
  });

  test('Добавление булки', () => {
    const stateBefore = getState();
    const action = addIngredient(BUN);
    const preparedPayload: TConstructorIngredient = action.payload;
    expect(preparedPayload.id).toBeDefined();

    const stateAfter = reducer(stateBefore, action);
    expect(stateAfter.bun).toEqual(preparedPayload);
    expect(stateAfter.ingredients).toHaveLength(0);
  });

  test('Удаление ингредиента (начинки)', () => {
    const stateWithIngredients = createStateWithIngredients([
      { id: CONSTRUCTOR_INGREDIENTS.MAIN_ID_1, ...MAIN_INGREDIENT },
      { id: CONSTRUCTOR_INGREDIENTS.MAIN_ID_2, ...SAUCE_INGREDIENT }
    ]);

    const action = removeIngredient(CONSTRUCTOR_INGREDIENTS.MAIN_ID_1);
    const stateAfter = reducer(stateWithIngredients, action);
    expect(stateAfter.ingredients).toHaveLength(1);
    expect(stateAfter.ingredients[0].id).toBe(CONSTRUCTOR_INGREDIENTS.MAIN_ID_2);
    expect(stateAfter.bun).toBeNull();
  });

  test('Удаление ингредиента из пустого списка', () => {
    const stateBefore = getState();
    const action = removeIngredient(CONSTRUCTOR_INGREDIENTS.NON_EXISTENT_ID);
    const stateAfter = reducer(stateBefore, action);
    expect(stateAfter.ingredients).toHaveLength(0);
    expect(stateAfter.bun).toBeNull();
  });

  test('Изменение порядка ингредиентов в начинке (moveIngredient)', () => {
    const stateWithIngredients = createStateWithIngredients([
      { id: CONSTRUCTOR_INGREDIENTS.MAIN_ID_1, ...MAIN_INGREDIENT },
      { id: CONSTRUCTOR_INGREDIENTS.MAIN_ID_2, ...SAUCE_INGREDIENT }
    ]);

    const action = moveIngredient({ fromIndex: 1, toIndex: 0 });
    const stateAfter = reducer(stateWithIngredients, action);
    expect(stateAfter.ingredients.map((i) => i.id)).toEqual([
      CONSTRUCTOR_INGREDIENTS.MAIN_ID_2,
      CONSTRUCTOR_INGREDIENTS.MAIN_ID_1
    ]);
    expect(stateAfter.bun).toBeNull();
  });

  test('Изменение порядка ингредиентов: перемещение в конец', () => {
    const stateWithIngredients = createStateWithIngredients([
      { id: CONSTRUCTOR_INGREDIENTS.MAIN_ID_1, ...MAIN_INGREDIENT },
      { id: CONSTRUCTOR_INGREDIENTS.MAIN_ID_2, ...SAUCE_INGREDIENT },
      { id: CONSTRUCTOR_INGREDIENTS.MAIN_ID_3, ...BUN }
    ]);

    const action = moveIngredient({ fromIndex: 0, toIndex: 2 });
    const stateAfter = reducer(stateWithIngredients, action);
    expect(stateAfter.ingredients.map((i) => i.id)).toEqual([
      CONSTRUCTOR_INGREDIENTS.MAIN_ID_2,
      CONSTRUCTOR_INGREDIENTS.MAIN_ID_3,
      CONSTRUCTOR_INGREDIENTS.MAIN_ID_1
    ]);
  });

  test('Очистка конструктора (clearConstructor)', () => {
    const stateWithIngredients = createStateWithBunAndIngredients(
      CONSTRUCTOR_INGREDIENTS.BUN_ID,
      [
        { id: CONSTRUCTOR_INGREDIENTS.MAIN_ID_1, ...MAIN_INGREDIENT },
        { id: CONSTRUCTOR_INGREDIENTS.MAIN_ID_2, ...SAUCE_INGREDIENT }
      ]
    );

    const action = clearConstructor();
    const stateAfter = reducer(stateWithIngredients, action);
    expect(stateAfter.bun).toBeNull();
    expect(stateAfter.ingredients).toHaveLength(0);
  });
});

function reducer(
  state: TConstructorState = initialState,
  action: any
): TConstructorState {
  return constructorSlice.reducer(state, action);
}