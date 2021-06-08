class adminCourseService{
    constructor(knex){
        this.knex = knex;
    }
    getAllSchedule(){
        return this.knex('class_course').join('course',{'course.id':'course_id'}).select(['class_course.id','class_course.start_date',this.knex.raw('to_json(course.*) as course')])
    }
    getCourse(){
        return this.knex('course').select('*');
    }
    addClassCourse(schedule){

        //REMEMBER POSTGRESQL ALWAYS STORE TIME AS UTC TIME, SO WHEN TRANSFER THERE WOULD BE TIME DIFFERENCE, SHOULD SEARCH HOW TO HANDLE IT
        return this.knex('class_course').insert({start_date: schedule.start_date,course_id:schedule.course_id});
    }
    getClassCourse(id){
        return this.knex('class_course').join('course',{'course.id':'course_id'}).select(['class_course.start_date',this.knex.raw('to_json(course.course_name) as course')]).where('class_course.id',id);
    }
    addClassSchedule(data){

        return this.knex('course_order').insert(data).returning('id');
    }
    addCourseSchedule(data){
        return this.knex('course_schedule').insert(data).returning('id');
    }
    getClassList(id){
        return this.knex('course_schedule').where('class_course_id',id).join('instructors',{'instructors.id':'instructor_id'}).select(['course_schedule.*',this.knex.raw('to_json(instructors.*) as instructor')]);
    }
    getOrderList(id){
        return this.knex('course_order').join('course_schedule',{'course_schedule.id':'course_schedule_id'}).select(['course_order.*',this.knex.raw('to_json(course_schedule.*) as course_schedule')]).where('course_schedule_id',id);
    }
    
}


module.exports = adminCourseService;