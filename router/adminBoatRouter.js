const express = require('express')

class adminBoatRouter {
    constructor(service) {
        this.service = service;
    }
    router() {
        const router = express.Router();
        router.get('/', async (req, res) => {
            let result = await this.service.getBoat();
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
                let getSchedulePromises = [];
                for (let i = 0; i < allSchedule.length; i++) {
                    getSchedulePromises.push(this.service.getScheduleById(allSchedule[i].schedule_id));
                }
                let scheduleResutls = await Promise.all(getSchedulePromises);
                console.log('scheduleResutls', scheduleResutls);
                for (let i = 0; i < scheduleResutls.length; i++) {
                    getInstructorPromises.push(this.service.getInstructorName(scheduleResutls[i][0].instructor_id));

                }
                let getInstuctorResult = await Promise.all(getInstructorPromises);
                console.log('getInstructorResult', getInstuctorResult);
                let result = [];
                for (let i = 0; i < allSchedule.length; i++) {
                    let bookingDate = new Date(allSchedule[i].booking_date);
                    bookingDate.setDate(bookingDate.getDate() + 1);
                    let newEvent = {
                        booking_date: bookingDate,
                        booking_session: allSchedule[i].booking_session,
                        instructor_name: getInstuctorResult[i][0].full_name,
                        booking_id: allSchedule[i].id,
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
                let classCapacity = await this.service.getBoatCapacity(req.body.boat_id);
                console.log(classCapacity);
                console.log(num);
                let forNum = num[0].sum + parseInt(req.body.people);
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
                console.log('book boat', req.body);
                let classCourseId = req.body.class_course_id;
                delete req.body.class_course_id;
                let result = await this.service.bookBoat(req.body);
                console.log(result);
                res.redirect(`/admin/boat/schedule/${classCourseId}`)
            } catch (error) {
                console.log(error)
            }

        })
        router.get('/course/:id', async (req, res) => {
            try {
                console.log('course', req.params);

                let classCourseId = req.params.id;
                let classList = await this.service.getClassList(classCourseId);
                console.log(classList);
                let instructorNamePromises = [];
                let boatListPromises = [];
                for (let i = 0; i < classList.length; i++) {
                    let courseId = classList[i].id;
                    let instructorId = classList[i].instructor_id;
                    instructorNamePromises.push(this.service.getInstructorName(instructorId));
                    boatListPromises.push(this.service.getBoatBooking(courseId));
                }
                let boatResult = await Promise.all(boatListPromises);
                let instructorResult = await Promise.all(instructorNamePromises);
                console.log('classroomResult', boatResult);
                console.log('instructorResult', instructorResult);
                let result = [];
                for (let j = 0; j < instructorResult.length; j++) {
                    for (let k = 0; k < boatResult[j].length; k++) {
                        let newResult = {
                            instructor: instructorResult[j][0].full_name,
                            booking_date: boatResult[j][k].booking_date,
                            booking_session: boatResult[j][k].booking_session,
                            num_people: boatResult[j][k].people
                        }
                        result.push(newResult);
                    }
                }
                let boatList = await this.service.getBoat();
                for (let i = 0; i < result.length; i++) {
                    console.log('boatList', boatList)
                    for (let j = 0; j < boatList.length; j++) {
                        if (result[i].boat_id == boatList[j].id) {
                            delete result[i].boat_id;
                            result[i].boat = boatList[j].name;
                        }
                    }
                }
                console.log('total', result);
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

module.exports = adminBoatRouter;