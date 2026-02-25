import {
  createOrder,
  getFeeds,
  getOrders,
  getOrderByNumber,
  initialState,
  TOrderState
} from './order-slice';
import { TOrder } from '@utils-types';
import { orderSlice } from './order-slice';

const orderMock: TOrder = {
  _id: '643d69a5c3f7b9001cfa093c',
  status: 'done',
  name: 'Фалленианский антарианский флюоресцентный бургер',
  createdAt: '2026-01-18T14:25:34.918Z',
  updatedAt: '2026-01-18T14:25:35.142Z',
  number: 99145,
  ingredients: [
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa0947',
    '643d69a5c3f7b9001cfa0945',
    '643d69a5c3f7b9001cfa093d'
  ]
};

const ordersMock: TOrder[] = [
  {
    _id: '69760919a64177001b328912',
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093c'
    ],
    status: 'done',
    name: 'Био-марсианский краторный бургер',
    createdAt: '2026-01-25T12:14:17.723Z',
    updatedAt: '2026-01-25T12:14:18.040Z',
    number: 99547
  },
  {
    _id: '697607b7a64177001b32890d',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093d'
    ],
    status: 'done',
    name: 'Био-марсианский флюоресцентный бургер',
    createdAt: '2026-01-25T12:08:23.472Z',
    updatedAt: '2026-01-25T12:08:23.826Z',
    number: 99546
  },
  {
    _id: '69760740a64177001b32890b',
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa093f',
      '643d69a5c3f7b9001cfa0940',
      '643d69a5c3f7b9001cfa093c'
    ],
    status: 'done',
    name: 'Метеоритный бессмертный краторный бургер',
    createdAt: '2026-01-25T12:06:24.524Z',
    updatedAt: '2026-01-25T12:06:24.805Z',
    number: 99545
  }
];

const feedsResponseMock = {
  success: true,
  orders: ordersMock,
  total: 12345,
  totalToday: 3
};

const orderInfoResponseMock = {
  success: true,
  orders: [orderMock]
};

describe('Тесты редьюсеров слайса заказов (orderSlice)', () => {
  const getState = (): TOrderState => ({ ...initialState });

  test('createOrder.pending: изменение состояния загрузки и сброс ошибки', () => {
    const stateBefore = getState();

    const nextState = orderSlice.reducer(
      stateBefore,
      createOrder.pending('', [])
    );

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
    expect(nextState.orderData).toBeNull();
    expect(nextState.orderNumber).toBeNull();
  });

  test('createOrder.fulfilled: сохранение данных заказа, номера и выключение загрузки', () => {
    const stateBefore = getState();

    const nextState = orderSlice.reducer(
      stateBefore,
      createOrder.fulfilled(orderMock, '', [])
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.orderData).toEqual(orderMock);
    expect(nextState.orderNumber).toBe(orderMock.number);
    expect(nextState.error).toBeNull();
  });

  test('createOrder.rejected: сохранение ошибки и выключение загрузки', () => {
    const stateBefore = getState();
    const errorMessage = 'Failed to create order';

    const nextState = orderSlice.reducer(
      stateBefore,
      // @ts-ignore
      createOrder.rejected(new Error(errorMessage), '', [], errorMessage)
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
    expect(nextState.orderData).toBeNull();
    expect(nextState.orderNumber).toBeNull();
  });

  test('getFeeds.fulfilled: обновление ленты заказов, total и totalToday', () => {
    const stateBefore = getState();

    const nextState = orderSlice.reducer(
      stateBefore,
      getFeeds.fulfilled(feedsResponseMock, '')
    );

    expect(nextState.orders).toEqual(ordersMock);
    expect(nextState.total).toBe(12345);
    expect(nextState.totalToday).toBe(3);
    expect(nextState.currentOrder).toBeNull();
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
    expect(nextState.orderData).toBeNull();
    expect(nextState.orderNumber).toBeNull();
  });

  test('getOrders.fulfilled: обновление заказов пользователя', () => {
    const stateBefore = getState();

    const nextState = orderSlice.reducer(
      stateBefore,
      getOrders.fulfilled(ordersMock, '')
    );

    expect(nextState.orders).toEqual(ordersMock);
    expect(nextState.currentOrder).toBeNull();
    expect(nextState.total).toBe(0);
    expect(nextState.totalToday).toBe(0);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
    expect(nextState.orderData).toBeNull();
    expect(nextState.orderNumber).toBeNull();
  });

  test('getOrderByNumber.fulfilled: обновление currentOrder', () => {
    const stateBefore = getState();

    const nextState = orderSlice.reducer(
      stateBefore,
      getOrderByNumber.fulfilled(orderInfoResponseMock, '', 12345)
    );

    expect(nextState.currentOrder).toEqual(orderMock);
    expect(nextState.orders).toEqual([]);
    expect(nextState.total).toBe(0);
    expect(nextState.totalToday).toBe(0);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
    expect(nextState.orderData).toBeNull();
    expect(nextState.orderNumber).toBeNull();
  });
});
