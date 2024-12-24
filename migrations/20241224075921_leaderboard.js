/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("leaderboard", (table) => {
    table
      .uuid("leaderboard_id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("user_id").references("user_id").inTable("users");
    table.integer("total_score").notNullable();
    table.integer("total_xp").notNullable();
    table.integer("rank").notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("leaderboard");
};
