import { call, select, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import history from '../../../services/history';
import { formatPrice } from '../../../util/format';

import { addProductToCartSuccess, updateProductAmountSuccess } from './actions';

function* addProductToCart(action) {
  const productExists = yield select((state) =>
    state.cart.find((product) => product.id === action.id)
  );

  const stock = yield call(api.get, `/stock/${action.id}`);

  const stockAmount = stock.data.amount;
  const currentAmount = productExists ? productExists.amount : 0;

  const amount = currentAmount + 1;

  if (amount > stockAmount) {
    toast.error('Quantidade solicitada fora de estoque');
    return;
  }

  if (productExists) {
    return yield put(updateProductAmountSuccess(action.id, amount));
  }

  const response = yield call(api.get, `/products/${action.id}`);

  const data = {
    ...response.data,
    amount: 1,
    priceFormatted: formatPrice(response.data.price),
  };

  yield put(addProductToCartSuccess(data));
  history.push('/cart');
}

function* updateAmount(action) {
  if (action.amount <= 0) return;

  const stock = yield call(api.get, `stock/${action.id}`);
  const stockAmount = stock.data.amount;

  if (action.amount > stockAmount) {
    toast.error('Quantidade solicitada fora de estoque');
    return;
  }

  yield put(updateProductAmountSuccess(action.id, action.amount));
}

export default all([
  takeLatest('@cart/ADD_REQUEST', addProductToCart),
  takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]);
