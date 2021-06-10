class adminClassroomService{
    constructor(knex){
        this.knex = knex;
    }
    getClassroom(){
        return this.knex('classroom').select(['id','name']);
    }
    getAllSchedule(){
        return this.knex('classroom_schedule').select('*');
    }
    getNumSchedule(classSchedule){
        return this.knex('classroom_schedule').where('classroom_id',classSchedule.classroom_id)
                    .where('booking_date',classSchedule.booking_date)
                    .where('booking_session',classSchedule.booking_session).sum('people')
    }
    getClassroomCapacity(classroom_id){
        return this.knex('classroom').where('id',classroom_id).select('capacity');
    }
    bookClassroom(order){
        return this.knex('classroom_schedule').insert(order).returning('id');
    }
    getClassList(classCourseId){
        return this.knex('course_schedule').where('class_course_id',classCourseId);
    }
    getInstructorName(instructorId){
        return this.knex('instructors').where('id',instructorId).select('full_name');

    }
    getClassroomBooking(courseId){
        return this.knex('classroom_schedule').where('schedule_id',courseId);
        
    }
    getScheduleById(scheduleId){
        return this.knex('course_schedule').where('id',scheduleId).select('*');
    }
    getClassCourseById(classId){
        return this.knex('class_course').where('id',classId).select('*');
    }
    deleteSchedule(bookingId){
        return this.knex('classroom_schedule').where('id',bookingId).del().returning('booking_date');
    }
}


module.exports = adminClassroomService;