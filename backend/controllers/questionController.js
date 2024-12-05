import asyncHandler from "express-async-handler"
import Question from "../models/questionModel.js"
import fileUpload from "../middlewares/imageMiddleware.js"
import { validationResult } from "express-validator"
import imageService from "../utils/imageService.js"
import CustomError from "../utils/customError.js"
import { checkAndAssignBadge, updatePoints } from "../utils/updatePointsAndBadges.js"

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
    res.send("Big boi")
})

export const single_question = asyncHandler(async (req, res) => {
    res.send("boss man")
})











