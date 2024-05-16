const Jobs = require("../models/jobs")
const { NotFoundError, BadRequestError } = require("../errors/index")
const { StatusCodes } = require("http-status-codes") 

// here at the jobs module, we fetch and update a job that is associated to a user
// we use the createdBy field to do this.
// this is user centered
// note the userId is being passed down from the auth middleware

const createJob = async (req, res) => {
    const { 
        company, position, status, createdBy
    } = req.body
    
    if (!company || !position ) {
        throw new BadRequestError("Please provide all the details for this job")
    }
    
    const user = req.user.userId
    const job = await Jobs.create({
        company, position, status, 
        createdBy: user
    })
    
    res.status(StatusCodes.CREATED).json({data: job})
}

const getSingleJob = async (req, res) => {
    const { id: jobId } = req.params
    const user = req.user.userId

    const job = await Jobs.findOne({
        _id: jobId, createdBy:user
    })

    if(!job){
        throw new NotFoundError("job not found")
    }

    res.status(StatusCodes.OK).json({data: job})
}

const getAllJobs = async (req, res) => {
    const user = req.user.userId

    const jobs  = await Jobs.find({
        createdBy: user
    }).sort(
        "createdAt"
    )

    res.status(StatusCodes.OK).json({data: jobs, count: jobs.length })
}

const updateJob = async (req, res) => {
    const { id: jobId } = req.params
    const user = req.user.userId
    const { company, position } = req.body
    
    if(!company || !position){
        throw new BadRequestError("company or position field cannot be empty")
    }

    const updatedJob = await Jobs.findByIdAndUpdate({
        _id: jobId, createdBy: user
    }, req.body, {new: true, runValidators: true})
   
    if(!updatedJob){
        throw new NotFoundError(`Job with Id: ${jobId} does not exist`)
    }
    res.status(StatusCodes.CREATED).json({data: updatedJob})
}

const deleteJob = async (req, res) => {
    const { id: jobId } = req.params
    const user = req.user.userId


    const job = await Jobs.findByIdAndDelete({
        _id: jobId, createdBy: user
    })

    if (!job) {
        throw new NotFoundError(`Job with id ${jobId} does not exist`)
    }

    res.status(StatusCodes.OK).json({status: "success"})
} 


module.exports = {
    createJob,
    getSingleJob,
    getAllJobs,
    updateJob,
    deleteJob
}




