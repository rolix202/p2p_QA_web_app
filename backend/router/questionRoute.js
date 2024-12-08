import { Router } from "express";
import { create_question, get_all_questions, post_answer, single_question } from "../controllers/questionController.js";
import { question_validation } from "../middlewares/validationMiddleware.js";

const router = Router()

router.route("/")
    .post(question_validation, create_question)
    .get(get_all_questions)

router.get("/:id", single_question)

router.post("/:id/answers", post_answer)

export default router