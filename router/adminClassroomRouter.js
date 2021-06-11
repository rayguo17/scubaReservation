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
            try {
                let result = await this.service.getAllSchedule();
                res.send(result);
            } catch (error) {
                console.log(error)
            }

        })
        router.get('/schedule/events', async (req, res) => {
            try {
                let allSchedule = await this.service.getAllSchedule();
                console.log('allSchedule', allSchedule);
                let getInstructorPromises = [];
                let getClassCoursePromises = [];
                let getSchedulePromises = [];
                for (let i = 0; i < allSchedule.length; i++) {
                    getSchedulePromises.push(this.service.getScheduleById(allSchedule[i].schedule_id));
                }
                let scheduleResutls = await Promise.all(getSchedulePromises);
                console.log('scheduleResutls', scheduleResutls);
                for (let i = 0; i < scheduleResutls.length; i++) {
                    getInstructorPromises.push(this.service.getInstructorName(scheduleResutls[i][0].instructor_id));
                    getClassCoursePromises.push(this.service.getClassCourseById(scheduleResutls[i][0].class_course_id));

                }
                let getInstuctorResult = await Promise.all(getInstructorPromises);
                let getClassCourseResult = await Promise.all(getClassCoursePromises);
                console.log('getInstructorResult', getInstuctorResult);
                console.log('getclassCourseResult', getClassCourseResult);
                let result = [];
                for (let i = 0; i < allSchedule.length; i++) {
                    let bookingDate = new Date(allSchedule[i].booking_date);
                    bookingDate.setDate(bookingDate.getDate() + 1);
                    let startDate = new Date(getClassCourseResult[i][0].start_date);
                    startDate.setDate(startDate.getDate() + 1);
                    let newEvent = {
                        booking_date: bookingDate,
                        booking_session: allSchedule[i].booking_session,
                        classroom_id: allSchedule[i].classroom_id,
                        class_course_id: getClassCourseResult[i][0].id,
                        instructor_name: getInstuctorResult[i][0].full_name,
                        course_id: getClassCourseResult[i][0].course_id,
                        booking_id: allSchedule[i].id,
                        start_date: startDate
                    }
                    result.push(newEvent);
                }
                console.log('formatted Result', result);
                res.send(result);
            } catch (error) {
                console.log(error);
            }
        })
        router.post('/scheduleCheck', async (req, res) => {
            try {
                console.log('body', req.body);
                let num = await this.service.getNumSchedule(req.body);
                let classCapacity = await this.service.getClassroomCapacity(req.body.item_id);
                console.log(classCapacity);
                console.log(num);
                let forNum = parseInt(num[0].sum) + parseInt(req.body.people);
                console.log('forecast num', forNum);
                console.log('capacity',classCapacity[0].capacity);
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
                req.body.classroom_id = req.body.bookingItem_id;
                delete req.body.bookingItem_id;
                let result = await this.service.bookClassroom(req.body);
                console.log(result);
                res.redirect(`/admin/course/schedule/${classCourseId}`)
            } catch (error) {
                console.log(error)
            }

        })
        router.get('/course/:id', async (req, res) => {
            try {
                console.log('course', req.params);

                let classCourseId = req.params.id;
                let classList = await this.service.getClassList(classCourseId);
                //console.log(classList);
                let instructorNamePromises = [];
                let classroomListPromises = [];
                for (let i = 0; i < classList.length; i++) {
                    let courseId = classList[i].id;
                    let instructorId = classList[i].instructor_id;
                    instructorNamePromises.push(this.service.getInstructorName(instructorId));
                    classroomListPromises.push(this.service.getClassroomBooking(courseId));
                }
                let classroomResult = await Promise.all(classroomListPromises);
                let instructorResult = await Promise.all(instructorNamePromises);
                //console.log('classroomResult', classroomResult);
                //console.log('instructorResult', instructorResult);
                let result = [];
                for (let j = 0; j < instructorResult.length; j++) {
                    for (let k = 0; k < classroomResult[j].length; k++) {
                        let newResult = {
                            instructor: instructorResult[j][0].full_name,
                            booking_date: classroomResult[j][k].booking_date,
                            booking_session: classroomResult[j][k].booking_session,
                            classroom_id: classroomResult[j][k].classroom_id,
                            num_people: classroomResult[j][k].people
                        }
                        result.push(newResult);
                    }
                }
                let classroomList = await this.service.getClassroom();
                for (let i = 0; i < result.length; i++) {
                    //console.log('classroomList', classroomList)
                    for (let j = 0; j < classroomList.length; j++) {
                        if (result[i].classroom_id == classroomList[j].id) {
                            delete result[i].classroom_id;
                            result[i].item = classroomList[j].name;
                        }
                    }
                }
                //console.log('total', result);
                res.send(result);
            } catch (error) {
                console.log(error)
            }
        })
        router.delete('/schedule', async (req, res) => {
            try {
                console.log(req.body);
                let result = await this.service.deleteSchedule(req.body.bookingId);
                console.log('delete', result);
                res.send('done');
            } catch (error) {
                console.log(error)
            }

        })


        return router;
    }

}

module.exports = adminClassroomRouter;