const express = require('express')
const fetch = require('node-fetch')

const app = express()
app.use(express.json())
app.use('/', express.static('frontend'))
const port = 3000

app.post('/cart-cost', async (req, res) => {
  if (req.body === {} || !Array.isArray(req.body['cart'])) {
    res.status(400).send()
  }
  const cart = req.body.cart
  const exchangeRates = await getExchangeRates().catch(() =>
    res.status(503).send()
  )

  try {
    const cartRubCost = cart
      .map(priceInRubles(exchangeRates))
      .reduce((acc, cost) => acc + cost, 0.0)
    res.send({
      RUB: roundCost(cartRubCost),
      EUR: roundCost(cartRubCost / exchangeRates.EUR.Value),
      USD: roundCost(cartRubCost / exchangeRates.USD.Value)
    })
  } catch (e) {
    res.status(400).send()
  }
})

async function getExchangeRates() {
  const data = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
  const json = await data.json()
  return json.Valute
}
function priceInRubles(exchangeRates) {
  return function({ quantity, currency, price }) {
    if (
      typeof quantity !== 'number' ||
      typeof currency !== 'string' ||
      typeof price !== 'number'
    ) {
      throw new Error('Invalid item')
    }
    if (currency === 'RUB') {
      return quantity * price
    }
    if (!(currency in exchangeRates)) {
      throw new Error('Unknown currency')
    }
    return quantity * exchangeRates[currency].Value * price
  }
}
function roundCost(cost) {
  return Math.round(cost * 100) / 100
}

app.listen(port)
