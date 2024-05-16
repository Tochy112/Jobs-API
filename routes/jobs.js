const express = require("express")
const router = express.Router()

const {
    createJob,
    getAllJobs,
    getSingleJob,
    updateJob,
    deleteJob
} = require("../controller/jobs")


router.route("/")
.post(createJob)
.get(getAllJobs)

router.route("/:id")
.get(getSingleJob)
.patch(updateJob)
.delete(deleteJob)

// router.post("/", createJob)
// router.get("/", getAllJobs)
// router.get("/:id", getSingleJob)
// router.patch("/:id", updateJob)
// router.delete("/:id", deleteJob)

module.exports = router