class adminClassroomService{
    constructor(knex){
        this.knex = knex;
    }
    getClassroom(){
        return this.knex('classroom').select(['id','name']);
    }
    getAllSchedule(){
        return this.knex('classroom_schedule').join('classroom',{'classroom.id':'classroom_id'})
                    .join('course_schedule',{'course_schedule.id':'schedule_id'})
                    .select(['classroom_schedule.*',this.knex.raw('to_json(classroom.name) as classroom'),this.knex.raw('to_json(course_schedule.course_id) as course_id')])
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
}


module.exports = adminClassroomService;