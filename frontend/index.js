function App() {
  const [cart, setCart] = React.useState([])
  const [name, setName] = React.useState('')
  const [quantity, setQuantity] = React.useState('0')
  const [currency, setCurrency] = React.useState('RUB')
  const [price, setPrice] = React.useState('0')
  const [cartCost, setCartCost] = React.useState(null)

  const addItem = () => {
    setCart([
      ...cart,
      {
        name,
        quantity: parseFloat(quantity),
        currency,
        price: parseFloat(price)
      }
    ])
  }

  const getCartCost = () => {
    fetch('/cart-cost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cart: cart })
    })
      .then(res => res.json())
      .then(res => setCartCost(res))
  }
  return (
    <div>
      <h1>Корзина</h1>
      <div>
        <h3>Новая покупка</h3>
        <br />
        Имя: <input value={name} onChange={e => setName(e.target.value)} />
        <br />
        Количество:{' '}
        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
        />
        <br />
        Валюта:{' '}
        <select value={currency} onChange={e => setCurrency(e.target.value)}>
          <option value="RUB">Рубли</option>
          <option value="USD">Доллары</option>
          <option value="EUR">Евро</option>
        </select>
        <br />
        Цена:{' '}
        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <br />
        <button onClick={addItem}>Добавить в корзину</button>
      </div>
      <div>
        <h3>Список покупок</h3>
        {cart.map(({ name, quantity, currency, price }) => (
          <li>
            {name}
            <div>Количество: {quantity}</div>
            <div>Валюта: {currency}</div>
            <div>Цена: {price}</div>
          </li>
        ))}
      </div>
      <button onClick={getCartCost}>Посчитать</button>
      {cartCost ? (
        <div>
          Стоимость корзины:
          <br />В рублях: {cartCost.RUB}
          <br />В долларах: {cartCost.USD}
          <br />В евро: {cartCost.EUR}
          <br />
        </div>
      ) : null}
    </div>
  )
}
ReactDOM.render(<App />, document.getElementById('root'))
