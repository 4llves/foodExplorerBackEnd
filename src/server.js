require('express-async-errors')

const express = require('express') // importo

const AppError = require('./utils/AppError')

const routes = require('./routes')

const app = express() // inicio o express
app.use(express.json()) // padrão que receberá as info pelo corpo da req

app.use(routes)

app.use((error, req, res, next) => {
  // verifica se a instacia do error vem de um AppError
  // e retorna se vem um erro do lado do cliente
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    })
  }

  // verifica se a instacia do error vem de um AppError
  // e retorna se vem um erro do lado do servidor
  console.log(error)
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
})

const PORT = 3333 // crio o numero da porta
app.listen(PORT, () => console.log(`Server ir running on Port ${PORT} 🚀`)) // aqui vai ficar escutando a porta que informei
