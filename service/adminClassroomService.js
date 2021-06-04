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
}

module.exports = adminClassroomService;