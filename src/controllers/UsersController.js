const { hash } = require('bcryptjs')
const AppError = require('../utils/AppError')

const sqliteConnection = require('../database/sqlite')

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body

    const database = await sqliteConnection()
    // Seleciono usuario onde for igual email X
    const checkUserExists = await database.get(
      `
        SELECT * FROM users
        WHERE email = (?)
      `,
      [email],
    )

    // se o user existir retorno este erro
    if (checkUserExists) {
      throw new AppError('Este email já está em uso.')
    }

    // utilio a funcao de hash com complexidade 8
    const hashedPassword = await hash(password, 8)

    // o comenado 'run' é para executar
    // INSERT é pra inserir INTO é onde.. no caso table users
    await database.run(
      `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
      `,
      [name, email, hashedPassword],
    )

    // 201 status de criado e um json vazio
    return res.status(201).json()
  }
}

module.exports = UsersController
