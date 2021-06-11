class adminPoolService{
    constructor(knex){
        this.knex = knex;
    }
    getPool(){
        return this.knex('pool').select(['id','name']);
    }
    getNumSchedule(poolSchedule){
        return this.knex('pool_schedule').where('pool_id',poolSchedule.item_id)
                    .where('booking_date',poolSchedule.booking_date)
                    .where('booking_session',poolSchedule.booking_session).sum('people');
    }
    getPoolCapacity(pool_id){
        return this.knex('pool').where('id',pool_id).select('capacity');
    }
    bookPool(order){
        return this.knex('pool_schedule').insert(order).returning('id');
    }
    getClassList(classCourseId){
        return this.knex('course_schedule').where('class_course_id',classCourseId).select('*');
    }
    getInstructorName(instructorId){
        return this.knex('instructors').where('id',instructorId).select('full_name');

    }
    getPoolBooking(courseId){
        return this.knex('pool_schedule').where('schedule_id',courseId).select('*');
    }
}

module.exports = adminPoolService;