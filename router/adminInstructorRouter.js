const express = require('express');
class adminInstructorRouter {
    constructor(service) {
        this.service = service;
    }
    router() {
        const router = express.Router();
        router.get('/', async (req, res) => {
            try {
                //console.log('getting instructors')
                let result = await this.service.getAllInstructors();
                //console.log(result);
                res.send(result);
            } catch (error) {
                console.log('adminInstructorRouter', error)
            }

        })

        return router;
    }
}

module.exports = adminInstructorRouter