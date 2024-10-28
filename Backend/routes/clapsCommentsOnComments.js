const express = require("express");
const router = express.Router();


const {
    clapsCommentsOnComments, 
    getTotalClapsCommentsOnComments,
    getUsersClapsCommentsOnComments
} = require("../controllers/clapsCommentsOnComments");


router.route("/:id").post(clapsCommentsOnComments);
router.route("/:id").get(getTotalClapsCommentsOnComments);
router.route("/users/:id").get(getUsersClapsCommentsOnComments);



module.exports = router;