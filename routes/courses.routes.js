const express = require("express");
const router = express.Router();
const verifyToken = require('../middleWare/verifyToken')
const coursesController = require("../controllers/courses.controllers");
const validation = require("../middleWare/validation");
const userRoles = require('../utilities/user-Roles')
const AllowedTo = require('../middleWare/allowedTo')
router.route("/")
            .get(verifyToken, coursesController.getAllCourses)
            .post(validation(), coursesController.addCourse);

router.route("/:courseId")
            .get(coursesController.getCourse)
            .patch(coursesController.updateCourse)
            .delete(verifyToken, AllowedTo(userRoles.ADMIN, userRoles.MANGER), coursesController.deleteCourse);

module.exports = router;
