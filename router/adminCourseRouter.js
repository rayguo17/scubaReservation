const express = require('express');

class adminCourseRouter {
    constructor(service) {
        this.service = service
    }
    router() {
        const router = express.Router();
        router.get('/', async (req, res) => {
            let result = await this.service.getCourse();
            //console.log('course',result);
            res.send(result);
        })
        router.get('/schedule', async (req, res) => {
            //console.log('in get route', req.session)
            let result = await this.service.getAllSchedule();
            //console.log('schedule', result);
            res.send(result);
        })
        router.post('/schedule', async (req, res) => {
            //date store in database and get different when getting out
            //console.log('this is req', new Date(req.body.start_date));
            let result = await this.service.addClassCourse(req.body);
            res.redirect('/admin/course');

        })
        router.get('/schedule/:id', async (req, res) => {
            //console.log('this is req',req.params);
            let result = await this.service.getClassCourse(req.params.id);

            //console.log(result);
            res.send(result);
        })
        router.post('/class', async (req, res) => {
            try {
                console.log(req.body);
                let newCourseSchedule = { class_course_id: req.body.class_course_id, instructor_id: req.body.instructor_id };
                let courseScheduleId = await this.service.addCourseSchedule(newCourseSchedule);
                //console.log('courseScheduleId', courseScheduleId[0]);

                if (req.body.full_name instanceof Array) {
                    let promises = [];
                    for (let i = 0; i < req.body.full_name.length; i++) {
                        let newCourseORder = {
                            course_schedule_id: courseScheduleId[0],
                            num_people: req.body.num_people[i],
                            phone_number: req.body.phone_number[i],
                            email: req.body.email[i],
                            full_name: req.body.full_name[i]
                        }
                        let result = this.service.addClassSchedule(newCourseORder);
                        promises.push(result);

                    }
                    Promise.all(promises).then((data) => {
                        //console.log('course_order_id', data);
                        res.redirect(`/admin/course/schedule/${req.body.class_course_id}`)
                    })
                } else {
                    let newCourseOrder = {
                        course_schedule_id: courseScheduleId[0],
                        num_people: req.body.num_people,
                        phone_number: req.body.phone_number,
                        email: req.body.email,
                        full_name: req.body.full_name
                    }
                    let result = await this.service.addClassSchedule(newCourseOrder);
                   // console.log('course_order_id', result);
                    res.redirect(`/admin/course/schedule/${req.body.class_course_id}`)
                }

            } catch (err) {
                console.log(err);
            }



            //let result = await this.service.addClassSchedule()
        })
        router.get('/schedule/:id/class', async (req, res) => {
            try {
                console.log('params', req.params);
                let result = await this.service.getClassList(req.params.id);
                console.log(result)
                res.send(result);
            } catch (err) {
                console.log(err);
            }

        })
        router.get('/class/:id',async (req,res)=>{
            try {
                //console.log('get Course order to schedule',req.params);
                let result = await this.service.getOrderList(req.params.id);
                console.log('get Course order to schedule',result);
                res.send(result);
            } catch (err) {
                console.log(err);
            }
        })

        return router;
    }
}

module.exports = adminCourseRouter;