import axios from 'axios'

const url = 'https://bot-n4w1.onrender.com'

const pingService = async () => {
  try {
    const response = await axios.get(url)
    console.log(`Ping response: ${response.status}`)
  } catch (error) {
    console.error('Error pinging service:', error.message)
  }
}

setInterval(pingService, 300000)

setTimeout(() => {
  setInterval(pingService, 600000)
}, 180000)
