exports.up = knex => knex.schema.createTable("dish", table => {
  table.increments("id")
  table.text("image").nullable()
  table.text("name")
  table.text("category")
  table.text("ingredients")
  table.text("price")
  table.text("description")

  table.timestamp("created_at").default(knex.fn.now())
  table.timestamp("updated_at").default(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable("dish")