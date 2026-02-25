import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type TCreateOrderState = {
  orderData: TOrder | null;
  orderNumber: number | null;
  loading: boolean;
  error: string | null;
};

export type TFeedOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  currentOrder: TOrder | null;
};

export type TOrderState = TCreateOrderState & TFeedOrdersState;

export const initialState: TOrderState = {
  orderData: null,
  orderNumber: null,
  loading: false,
  error: null,

  orders: [],
  total: 0,
  totalToday: 0,
  currentOrder: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/create', async (ingredients, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredients);
    if (!response.success) {
      return rejectWithValue('Failed to create order');
    }
    return response.order;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || 'Network error');
    }
    return rejectWithValue('Network error');
  }
});

export const getFeeds = createAsyncThunk(
  'feeds',
  async () => await getFeedsApi()
);

export const getOrders = createAsyncThunk(
  'user/orders',
  async () => await getOrdersApi()
);

export const getOrderByNumber = createAsyncThunk(
  'user/orderbyNumber',
  async (number: number) => await getOrderByNumberApi(number)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderData = null;
      state.orderNumber = null;
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
        state.orderNumber = action.payload.number;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.error =
          typeof payload === 'string' ? payload : 'Error creating order';
      })

      .addCase(getFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })

      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })

      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        if (action.payload.orders.length > 0) {
          state.currentOrder = action.payload.orders[0];
        }
      });
  }
});

export const { clearOrder, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
