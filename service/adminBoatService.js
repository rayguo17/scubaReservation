class adminBoatService{
    constructor(knex){
        this.knex = knex;
    }
    getBoat(){
        return this.knex('boat').select(['id','name']);
    }
    getAllSchedule(){
        return this.knex('boat_schedule').select('*');
    }
    getNumSchedule(boatSchedule){
        return this.knex('boat_schedule').where('boat_id',boatSchedule.boat_id)
                    .where('booking_date',boatSchedule.booking_date)
                    .where('booking_session',boatSchedule.booking_session).sum('people')
    }
    getBoatCapacity(boat_id){
        return this.knex('boat').where('id',boat_id).select('capacity');
    }
    bookBoat(order){
        return this.knex('boat_schedule').insert(order).returning('id');
    }
    getClassList(classCourseId){
        return this.knex('course_schedule').where('class_course_id',classCourseId);
    }
    getInstructorName(instructorId){
        return this.knex('instructors').where('id',instructorId).select('full_name');

    }
    getBoatBooking(courseId){
        return this.knex('boat_schedule').where('course_schedule_id',courseId);
        
    }
    getScheduleById(scheduleId){
        return this.knex('course_schedule').where('id',scheduleId).select('*');
    }
    deleteSchedule(bookingId){
        return this.knex('boat_schedule').where('id',bookingId).del().returning('booking_date');
    }
}


module.exports = adminBoatService;