const { transformAuthInfo } = require("passport");

exports.up = function(knex) {
  return knex.schema.createTable('boats_schedule',(table)=>{
        table.increments('id');
        table.date('booking_data');
        table.integer('booking_session');
        table.integer('boat_id');
        table.foreign('boat_id').references('boat.id');
        table.integer('course_schedule_id');
        table.integer('people');
      })
  }).then(()=>{
      return knex.schema.createTable('boat',(table)=>{
        table.increments('id');
        table.integer('capacity');
        table.string('type');
      })
  }).then(()=>{
      return knex.schema.createTable('pool_schedule',(table)=>{
        table.increments('id');
        table.date('booking_data');
        table.integer('booking_session');
        table.integer('pool_id');
        table.foreign('pool_id').references('pool.id');
        table.integer('course_schedule_id');
        table.integer('people');
      })
  }).then(()=>{
      return knex.schema.createTable('pool',(table)=>{
          table.increments('id');
          table.string('name');
          table.integer('capacity');
      })
  }).then(()=>{
      return knex.schema.createTable('instructors',(table)=>{
          table.increments('id');
          table.string('full_name');
          table.string('username');
          table.string('password');
          table.string('level');
          table.integer('phone_number');
          table.string('email');
      })
  }).then(()=>{
    return knex.schema.createTable('course',(table)=>{
        table.increments('id');
        table.string('course_name');
        table.string('category');
    })

  }).then(()=>{
      return knex.schema.createTable('course_schedule',(table)=>{
          table.increments('id');
          table.foreign('id').references('pool_schedule.course_schedule_id');
          table.foreign('id').references('boats_schedule.course_schedule_id');
          table.date('start_date');
          table.integer('course_id');
          table.foreign('course_id').references('course.id');
          table.integer('instructor_id');
          table.foreign('instructor_id').references('instructors.id');
      })
  }).then(()=>{
      return knex.schema.createTable('course_order',(table)=>{
          table.increments('id');
          table.integer('schedule_id').unsigned();
          table.foreign('schedule_id').references('course_schedule.id');
          table.integer('num_people');
          table.integer('phone_number');
          table.string('email');
          table.string('full_name');
      })
  }).then(()=>{
      return knex.schema.createTable('student',(table)=>{
          table.increments('id');
          table.integer('order_id');
          table.foreign('order_id').references('course_order.id');
          table.string('full_name');
          table.string('email');
          table.integer('phone_number')
      })
  }).then(()=>{
      return knex.schema.createTable('student_gear',(table)=>{
          table.increments('id');
          table.integer('student_id');
          table.foreign('student_id').references('student.id');
          table.boolean('mask');
          table.boolean('regulator');
          table.string('bcd');
          table.string('wetsuit');
          table.integer('boots');
          table.string('fins');
          table.string('others');
      })
  }).then(()=>{
      return knex.schema.createTable('classroom',(table)=>{
          table.increments('id');
          table.integer('capacity');
          table.string('name');
      })
  }).then(()=>{
      return knex.schema.createTable('classroom_schedule',(table)=>{
          table.increments('id');
          table.date('booking_date');
          table.integer('booking_session');
          table.integer('people');
          table.integer('classroom_id');
          table.foreign('classroom_id').references('classroom.id');
          table.integer('schedule_id');
          table.foreign('schedule_id').references('course_schedule.id');
      })
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('classroom_schedule').dropTable('classroom').dropTable('student_gear').dropTable('student').dropTable('course_order').dropTable('course_schedule')
                .dropTable('course').dropTable('instructors').dropTable('pool').dropTable('boat');
};
