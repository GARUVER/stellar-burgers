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

const getState = (): TConstructorState => ({ ...initialState });

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

describe('Тесты редьюсера конструктора бургера', () => {
  test('Добавление ингредиента (начинки)', () => {
    const stateBefore = getState();
    const action = addIngredient(mainIngredient);
    const preparedPayload: TConstructorIngredient = action.payload;
    expect(preparedPayload.id).toBeDefined();
    expect(preparedPayload._id).toBe(mainIngredient._id);

    const stateAfter = reducer(stateBefore, action);
    expect(stateAfter.bun).toBeNull();
    expect(stateAfter.ingredients).toHaveLength(1);
    expect(stateAfter.ingredients[0]).toEqual(preparedPayload);
  });

  test('Добавление булки', () => {
    const stateBefore = getState();
    const action = addIngredient(bun);
    const preparedPayload: TConstructorIngredient = action.payload;
    expect(preparedPayload.id).toBeDefined();

    const stateAfter = reducer(stateBefore, action);
    expect(stateAfter.bun).toEqual(preparedPayload);
    expect(stateAfter.ingredients).toHaveLength(0);
  });

  test('Удаление ингредиента (начинки)', () => {
    const stateWithIngredients: TConstructorState = {
      ...initialState,
      ingredients: [
        { id: 'id1', ...mainIngredient },
        { id: 'id2', ...sauceIngredient }
      ]
    };

    const idToRemove = 'id1';
    const action = removeIngredient(idToRemove);
    const stateAfter = reducer(stateWithIngredients, action);
    expect(stateAfter.ingredients).toHaveLength(1);
    expect(stateAfter.ingredients[0].id).toBe('id2');
    expect(stateAfter.bun).toBeNull();
  });

  test('Удаление ингредиента из пустого списка', () => {
    const stateBefore = getState();
    const idToRemove = 'nonexistent-id';
    const action = removeIngredient(idToRemove);
    const stateAfter = reducer(stateBefore, action);
    expect(stateAfter.ingredients).toHaveLength(0);
    expect(stateAfter.bun).toBeNull();
  });

  test('Изменение порядка ингредиентов в начинке (moveIngredient)', () => {
    const stateWithIngredients: TConstructorState = {
      ...initialState,
      ingredients: [
        { id: 'id1', ...mainIngredient },
        { id: 'id2', ...sauceIngredient }
      ]
    };

    const action = moveIngredient({ fromIndex: 1, toIndex: 0 });
    const stateAfter = reducer(stateWithIngredients, action);
    expect(stateAfter.ingredients.map((i) => i.id)).toEqual(['id2', 'id1']);
    expect(stateAfter.bun).toBeNull();
  });

  test('Изменение порядка ингредиентов: перемещение в конец', () => {
    const stateWithIngredients: TConstructorState = {
      ...initialState,
      ingredients: [
        { id: 'id1', ...mainIngredient },
        { id: 'id2', ...sauceIngredient },
        { id: 'id3', ...bun }
      ]
    };

    const action = moveIngredient({ fromIndex: 0, toIndex: 2 });
    const stateAfter = reducer(stateWithIngredients, action);
    expect(stateAfter.ingredients.map((i) => i.id)).toEqual([
      'id2',
      'id3',
      'id1'
    ]);
  });

  test('Очистка конструктора (clearConstructor)', () => {
    const stateWithIngredients: TConstructorState = {
      ...initialState,
      bun: { id: 'bun_id', ...bun },
      ingredients: [
        { id: 'id1', ...mainIngredient },
        { id: 'id2', ...sauceIngredient }
      ]
    };

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
