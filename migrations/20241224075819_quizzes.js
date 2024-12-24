/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('quizzes', table => {
        table.uuid('quiz_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.enu('grade', ['SD-Kelas-1', 'SD-Kelas-2', 'SD-Kelas-3', 'SD-Kelas-4', 'SD-Kelas-5', 'SD-Kelas-6', 'SMP-Kelas-7', 'SMP-Kelas-8', 'SMP-Kelas-9', 'SMA-Kelas-10', 'SMA-Kelas-11', 'SMA-Kelas-12', 'S1', 'S2']).notNullable();
        table.enu('subject', ['Bahasa Indonesia', 'Sains', 'Matematika', 'Sejarah', 'Geografi', 'Fisika', 'Kimia', 'Biologi', 'Pesantren']).notNullable();
        table.text('question').notNullable();
        table.text('correct_answer').notNullable();
        table.jsonb('options').notNullable();
        table.uuid('created_by').references('user_id').inTable('users');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('quizzes');
};
