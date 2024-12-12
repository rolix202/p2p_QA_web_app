import { Router } from "express";
import { create_question, deleteAnswer, downvoteAnswer, editAnswer, get_all_questions, post_answer, single_question, upvoteAnswer } from "../controllers/questionController.js";
import { question_validation } from "../middlewares/validationMiddleware.js";
import { isAuthenticated } from "../middlewares/authenticateMiddleware.js";
import fileUpload from "../middlewares/imageMiddleware.js"

const router = Router()

router.route("/")
    .post(isAuthenticated, fileUpload('photo_upload'), question_validation, create_question)
    .get(get_all_questions)

router.get("/:id", single_question)

router.route("/:id/answer")
    .post(isAuthenticated, post_answer)

router.patch("/:id/answer/edit", isAuthenticated, editAnswer)
router.delete("/:id/answer/delete", isAuthenticated, deleteAnswer)

router.post("/:id/upvote", isAuthenticated, upvoteAnswer)
router.post("/:id/downvote", isAuthenticated, downvoteAnswer)

export default router