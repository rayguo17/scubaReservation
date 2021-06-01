
exports.up = function(knex) {
  return knex.schema.createTable('boats',(table)=>{
      table.increments('id');
      table.integer('available_amount_of_people');
      table.string('species');
  }).then(()=>{
      return knex.schema.createTable('items',(table)=>{
          table.increments('id');
          table.string('name');
          table.string('size');
          table.integer('instock_quantity');
          table.integer('available_quantity');
      })
  }).then(()=>{
      return knex.schema.createTable('instructors',(table)=>{
          table.increments('id');
          table.string('usename');
          table.string('password');
          table.string('level');

      })
  }).then(()=>{
      return knex.schema.createTable('course_schedule',(table)=>{
          table.increments('id');
          table.date('start_date');
          table.string('course_name');
          table.integer('instructor_id');
          table.foreign('instructors').references('instructors.id');
      })
  }).then(()=>{
      return knex.schema.createTable('course_order',(table)=>{
          table.increments('id');
          table.integer('course_id').unsigned();
          table.foreign('course_id').references('course_schedule.id');
          table.integer('num_people');
          table.integer('phone_number');
          table.string('email');
      })
  }).then(()=>{
      return knex.schema.createTable('course_student',(table)=>{
          table.increments('id');
          table.integer('course_id');
          table.integer('order_id');
          table.foreign('course_id').references('course_schedule.id');
          table.foreign('order_id').references('course_id.id');
      })
  })
};

exports.down = function(knex) {
  
};
