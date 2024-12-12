import asyncHandler from "express-async-handler"
import Question from "../models/questionModel.js"
import { validationResult } from "express-validator"
import imageService from "../utils/imageService.js"
import CustomError from "../utils/customError.js"
import { checkAndAssignBadge, updatePoints } from "../utils/updatePointsAndBadges.js"
import Answer from "../models/answerModel.js"
import mongoose from "mongoose"

export const create_question = asyncHandler(async (req, res) => {
    
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
    
})

export const get_all_questions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sort = '-createdAt', cateory, userId, search } = req.query;

    // Converting page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const filter = {};

    if (cateory) filter.category = cateory;
    if (userId) filter.postedBy = userId;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    // Fetching questions with pagination, sorting, and filtering
    const questions = await Question.find(filter)
        .sort(sort)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .populate('postedBy', 'firstName lastName communityID')
        .lean();

    // Fetching answer counts for each question
    const questionsWithAnswerCounts = await Promise.all(
        questions.map(async (question) => {
            const answerCount = await Answer.countDocuments({ question: question._id });
            return { ...question, answerCount };
        })
    );

    const totalQuestions = await Question.countDocuments(filter);

    res.status(200).json({
        status: 'success',
        data: questionsWithAnswerCounts,
        meta: {
            total: totalQuestions,
            page: pageNumber,
            limit: pageSize,
            totalPages: Math.ceil(totalQuestions / pageSize),
        },
    });
});

export const single_question = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ status: 'fail', message: 'Invalid question' });
    }

    const [ question, answers ] = await Promise.all([
        Question.findById(id).populate('postedBy', 'communityID firstName lastName').lean(),
        Answer.find({ question: id })
            .populate('postedBy', 'communityID firstName lastName points badges')
            .sort({ createdAt: -1 }) // Latest answers first
            .lean()
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
    const { id } = req.params;

    try {
        const [question, no_of_answers] = await Promise.all([
            Question.findById(id).select('postedBy'),
            Answer.countDocuments({ postedBy: req.user.id })
        ]);

        if (!question) {
            return res.status(404).json({ status: 'fail', message: 'Question not found!' });
        }

        const answer_info = new Answer({
            answerBody: req.body.answerBody,
            postedBy: req.user.id,
            question: id
        });

        await answer_info.save();

        let rollbackRequired = false;

        try {
            await updatePoints(req.user.id, 5);
        } catch (error) {
            rollbackRequired = true;
            console.error('Failed to update points:', error);
        }

        try {
            if (no_of_answers === 0) {
                await checkAndAssignBadge(req.user.id, "Problem Solver");
            }
        } catch (error) {
            rollbackRequired = true;
            console.error('Failed to assign badge:', error);
        }

        if (rollbackRequired) {
            await Answer.findByIdAndDelete(answer_info._id);
            return res.status(500).json({
                status: 'fail',
                message: 'Failed to process answer fully. Answer rolled back.',
            });
        }

        res.status(201).json({
            status: 'success',
            message: 'Answer posted successfully',
            data: answer_info
        });

    } catch (error) {
        console.error('Error posting answer:', error);
        res.status(500).json({
            status: 'fail',
            message: 'Failed to post the answer. Please try again later.'
        });
    }
});

export const editAnswer = asyncHandler(async (req, res) => {
    const { id } = req.params; // Answer ID
    const { answerBody } = req.body;

    if (!answerBody) {
        return res.status(400).json({ status: 'fail', message: 'Answer body is required.' });
    }

    // Find the answer by ID
    const answer = await Answer.findById(id);
    if (!answer) {
        return res.status(404).json({ status: 'fail', message: 'Answer not found.' });
    }

    // Check if the user is the one who posted the answer
    if (answer.postedBy.toString() !== req.user.id) {
        return res.status(403).json({ status: 'fail', message: 'You are not authorized to edit this answer.' });
    }

    // Update the answer body
    answer.answerBody = answerBody;
    await answer.save();

    res.status(200).json({ status: 'success', message: 'Answer updated successfully', data: answer });
});

export const deleteAnswer = asyncHandler(async (req, res) => {
    const { id } = req.params; // Answer ID

    // Find the answer by ID
    const answer = await Answer.findById(id);
    if (!answer) {
        return res.status(404).json({ status: 'fail', message: 'Answer not found.' });
    }

    // Check if the user is the one who posted the answer
    if (answer.postedBy.toString() !== req.user.id) {
        return res.status(403).json({ status: 'fail', message: 'You are not authorized to delete this answer.' });
    }

    // Delete the answer
    await answer.remove();

    res.status(200).json({ status: 'success', message: 'Answer deleted successfully' });
});

export const upvoteAnswer = asyncHandler(async (req, res) => {
    const { id } = req.params; // Answer ID

    // Find the answer by ID
    const answer = await Answer.findById(id);
    if (!answer) {
        return res.status(404).json({ status: 'fail', message: 'Answer not found.' });
    }

    // Check if the user already voted
    if (answer.votes.includes(req.user.id)) {
        return res.status(400).json({ status: 'fail', message: 'You already voted on this answer.' });
    }

    // Add the user to the votes array (upvoting)
    answer.votes.push(req.user.id);
    answer.score += 1; // Increase score by 1 for upvote

    await answer.save();

    // Increment points for upvoting
    await updatePoints(req.user.id, 1); // Adding 1 point for upvote (can be adjusted)

    res.status(200).json({ status: 'success', message: 'Answer upvoted successfully', data: answer });
});

export const downvoteAnswer = asyncHandler(async (req, res) => {
    const { id } = req.params; // Answer ID

    // Find the answer by ID
    const answer = await Answer.findById(id);
    if (!answer) {
        return res.status(404).json({ status: 'fail', message: 'Answer not found.' });
    }

    // Check if the user already voted
    if (answer.votes.includes(req.user.id)) {
        return res.status(400).json({ status: 'fail', message: 'You already voted on this answer.' });
    }

    // Add the user to the votes array (downvoting)
    answer.votes.push(req.user.id);
    answer.score -= 1; // Decrease score by 1 for downvote

    await answer.save();

    // Increment points for downvoting
    await updatePoints(req.user.id, -1); // Deducting 1 point for downvote (can be adjusted)

    res.status(200).json({ status: 'success', message: 'Answer downvoted successfully', data: answer });
});















