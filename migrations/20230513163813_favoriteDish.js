exports.up = knex => knex.schema.createTable("favoriteDish", table => {
  table.increments("id")
  table.text('userId').notNullable()
  table.foreign('userId').references('id').inTable('users')
  table.text('dishId').notNullable()
  table.foreign('dishId').references('id').inTable('dish')

  table.timestamp("created_at").default(knex.fn.now())
  table.timestamp("updated_at").default(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable("favoriteDish")