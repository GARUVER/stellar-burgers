import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

import { TIngredient } from '@utils-types';
import { selectIngredients } from '@selectors';
import { OrderCardProps } from './type';
import { OrderCardUI } from '../ui/order-card';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  // Формирование данных для отображения заказа
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    // Получение информации об ингредиентах заказа
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        return ingredient ? [...acc, ingredient] : acc;
      },
      []
    );

    // Общая стоимость заказа
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    // Ингредиенты для отображения (первые maxIngredients)
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    // Количество оставшихся ингредиентов
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
