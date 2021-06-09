class adminInstructorService{
    constructor(knex){
        this.knex = knex;
    }
    getAllInstructors(){
        return this.knex('instructors').select(['instructors.full_name','instructors.id']);

    }
}

module.exports = adminInstructorService;