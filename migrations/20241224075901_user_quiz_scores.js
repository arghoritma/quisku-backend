/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_quiz_scores', table => {
        table.uuid('score_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('user_id').references('user_id').inTable('users');
        table.uuid('quiz_id').references('quiz_id').inTable('quizzes');
        table.integer('score').notNullable();
        table.integer('xp_earned').notNullable();
        table.timestamp('completed_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('user_quiz_scores');
};


