class adminCourseService{
    constructor(knex){
        this.knex = knex;
    }
    getAllSchedule(){
        return this.knex('course_schedule').join('course',{'course.id':'course_id'}).select(['course_schedule.id','course_schedule.start_date',this.knex.raw('to_json(course.*) as course')])
    }
    getCourse(){
        return this.knex('course').select('*');
    }
}


module.exports = adminCourseService;