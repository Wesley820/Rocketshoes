import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdAddShoppingCart } from 'react-icons/md';
import api from '../../services/api';
import { formatPrice } from '../../util/format';

import { addProductToCartRequest } from '../../store/modules/cart/actions';

import { ProductList } from './styles';

function Home() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  const amountProduct = useSelector((state) =>
    state.cart.reduce((amount, product) => {
      amount[product.id] = product.amount;

      return amount;
    }, {})
  );

  useEffect(() => {
    async function handleGetProducts() {
      const response = await api.get('products');

      const data = response.data.map((product) => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }));

      setProducts(data);
    }

    handleGetProducts();
  }, []);

  function handleAddProductToCart(product) {
    dispatch(addProductToCartRequest(product.id));
  }

  return (
    <ProductList>
      {products.map((product) => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>
          <button type="button" onClick={() => handleAddProductToCart(product)}>
            <div>
              <MdAddShoppingCart size={16} color="#fff" />{' '}
              {amountProduct[product.id] || 0}
            </div>
            <span>Adicionar ao carrinho</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
}

export default Home;
