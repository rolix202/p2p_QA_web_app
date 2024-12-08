import asyncHandler from "express-async-handler"
import Question from "../models/questionModel.js"
import fileUpload from "../middlewares/imageMiddleware.js"
import { validationResult } from "express-validator"
import imageService from "../utils/imageService.js"
import CustomError from "../utils/customError.js"
import { checkAndAssignBadge, updatePoints } from "../utils/updatePointsAndBadges.js"
import Answer from "../models/answerModel.js"
import mongoose from "mongoose"

export const create_question = [
    fileUpload('photo_upload'),

    asyncHandler(async (req, res) => {
    
    const errors = validationResult(req)
    const errorsArray = errors.array()

    if (req.fileValidationError){
        errorsArray.push({ msg: req.fileValidationError })
    }

    if (errorsArray.length > 0){
        if (req.files) await imageService.deleteLocalFiles(req.files);

        return res.status(400).json({
            message: "fail",
            errors: errorsArray
        })
    }


    const questionDetails = {
        title: req.body.title,
        description: req.body.description,
        postedBy: req.user.id,
        category: req.body.category,
        photo_upload: []
    }

    try {
        if (req.files){
            for (const file of req.files){
                const uploadResult = await imageService.uploadImageToCloudinary(file.path);
                
                questionDetails.photo_upload.push({
                    image_public_url: uploadResult.public_id,
                    image_secure_url: uploadResult.secure_url,
                })

                await imageService.deleteLocalFile(file.path)
            }
        }

        const question = new Question(questionDetails)

        await question.save();

        const { postedBy } = question

        const no_of_questions = await Question.countDocuments({ postedBy })

        try {
            if (no_of_questions){
                if (no_of_questions === 1){
                    await updatePoints(postedBy, 10)
                    await checkAndAssignBadge(postedBy, "Icebreaker", true)
                } else {
                    await updatePoints(postedBy, 5)
                }
            }
            
            res.status(201).json({ status: "success", message: 'Question created successfully', data: question });
        } catch (updateError) {
            await Question.findByIdAndDelete(question._id); 

            res.status(500).json({
                status: "fail",
                message: "Issue updating points and badges.",
                error: updateError.message
            });
        }

    } catch (error) {
        console.log(error);
            
            await imageService.deleteLocalFiles(req.files); 
            await imageService.cleanupFailedUpload(questionDetails.photo_upload);
            res.status(500).json({ status: "fail", errors: [{ msg: "Failed to post question. Try again!" }] });
    }
    
})]

export const get_all_questions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sort = '-createdAt', cateory, userId, search } = req.query;

    // converting page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const filter = {}

    if (cateory) filter.category = cateory;
    if (userId) filter.postedBy = userId;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ]
    }

    // Executing the query with pagination, sorting, and filtering
    const questions = await Question.find(filter)
        .sort(sort)
        .skip((pageNumber -1) * pageSize)
        .limit(pageSize)
        .populate('postedBy', 'firstName lastName communityID')
        .lean();

    const totalQuestions = await Question.countDocuments(filter)

    res.status(200).json({
        status: "success",
        data: questions,
        meta: {
            total: totalQuestions,
            page: pageNumber,
            limit: pageSize,
            totalPages: Math.ceil(totalQuestions / pageSize)
        }
    })
})

export const single_question = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ status: 'fail', message: 'Invalid question' });
    }

    const [ question, answers ] = await Promise.all([
        Question.findById(id).populate('postedBy', 'communityID firstName lastName').lean(),
        Answer.find({ question: id }).populate('postedBy', 'communityID firstName lastName points badges').lean()
    ])

    if (!question) {
        return res.status(404).json({ status: 'fail', message: 'Question not found' });
    }

    res.status(200).json({
        status: "success",
        data: { question, answers },
        meta: {
            totalAnswer: answers.length
        }
    })
    
})

export const post_answer = asyncHandler(async (req, res) => {
    res.send("howdy")
})











