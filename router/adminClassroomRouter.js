const express = require('express')

class adminClassroomRouter {
    constructor(service) {
        this.service = service;
    }
    router() {
        const router = express.Router();
        router.get('/', async (req, res) => {
            let result = await this.service.getClassroom();
            res.send(result);
        });
        router.get('/schedule', async (req, res) => {
            let result = await this.service.getAllSchedule();
            res.send(result);
        })
        router.post('/scheduleCheck', async (req, res) => {
            try {
                console.log('body', req.body);
                let num = await this.service.getNumSchedule(req.body);
                let classCapacity = await this.service.getClassroomCapacity(req.body.classroom_id);
                console.log(classCapacity);
                //console.log(num);
                let forNum = num + req.body.people;
                if (forNum > classCapacity[0].capacity) {
                    res.send(false);
                } else {
                    res.send(true);
                }
            } catch (error) {
                console.log(error);
            }


        })
        router.post('/schedule', async (req, res) => {
            try {
                console.log('book classroom', req.body);
                let classCourseId = req.body.class_course_id;
                delete req.body.class_course_id; 
                let result = await this.service.bookClassroom(req.body);
                console.log(result);
                res.redirect(`/admin/course/schedule/${classCourseId}`)
            } catch (error) {
                console.log(error)
            }

        })
        router.get('/course/:id',async (req,res)=>{
            try {
                console.log('course',req.params);
                
                let classCourseId = req.params.id;
                let classList = await this.service.getClassList(classCourseId);
                console.log(classList);
                let instructorNamePromises = [];
                let classroomListPromises = [];
                for(let i=0;i<classList.length;i++){
                    let courseId = classList[i].id;
                    let instructorId = classList[i].instructor_id;
                    instructorNamePromises.push(this.service.getInstructorName(instructorId));
                    classroomListPromises.push(this.service.getClassroomBooking(courseId));
                }
                let classroomResult = await Promise.all(classroomListPromises);
                let instructorResult = await Promise.all(instructorNamePromises);
                console.log('classroomResult',classroomResult);
                console.log('instructorResult',instructorResult);
                let result = [];
                for(let j =0;j<instructorResult.length;j++){
                    for(let k=0;k<classroomResult[j].length;k++){
                        let newResult = {
                            instructor:instructorResult[j][0].full_name,
                            booking_date:classroomResult[j][k].booking_date,
                            booking_session:classroomResult[j][k].booking_session,
                            classroom_id:classroomResult[j][k].classroom_id,
                            num_people:classroomResult[j][k].people
                        }
                        result.push(newResult);
                    }
                }
                let classroomList = await this.service.getClassroom();
                for(let i=0;i<result.length;i++){
                    console.log('classroomList',classroomList)
                    for(let j=0;j<classroomList.length;j++){
                        if(result[i].classroom_id==classroomList[j].id){
                            delete result[i].classroom_id;
                            result[i].classroom = classroomList[j].name;
                        }
                    }
                }
                console.log('total',result);
                res.send(result);
            } catch (error) {
                console.log(error)
            }
        })


        return router;
    }

}

module.exports = adminClassroomRouter;