import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    ArrowUpIcon,
    ArrowDownIcon,
    CheckCircleIcon,
    UserCircleIcon,
    PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";

const SingleQuestionPage = () => {
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newAnswer, setNewAnswer] = useState("");

    const { id } = useParams();

    const fetchQuestion = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/v1/question/${id}`);

            setQuestion(data.data.question);
            setAnswers(data.data.answers);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching question:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, [id]);

    const handleVote = async (answerId, type) => {
        try {
            const { data } = await axios.post(`/api/answers/${answerId}/vote`, { type });
            setAnswers((prevAnswers) =>
                prevAnswers.map((answer) =>
                    answer._id === answerId
                        ? { ...answer, votes: data.updatedVotes }
                        : answer
                )
            );
        } catch (error) {
            console.error("Error voting:", error);
        }
    };
 
    const handleAddAnswer = async () => {
        if (!newAnswer.trim()) return;
        try {
            await axios.post(`http://localhost:5000/api/v1/question/${id}/answer`, {
                questionId: question._id,
                answerBody: newAnswer,
            }, { withCredentials: true });
            setNewAnswer("");
            fetchQuestion(); // Re-fetch the data
        } catch (error) {
            console.error("Error adding answer:", error);
        }
    };
    

    if (loading) return <p>Loading...</p>;

    return (
        <div className="bg-gray-100 min-h-screen pb-16">

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-green-500 to-green-700 text-white py-16">
                <div
                    className={`relative z-10 max-w-5xl mx-auto px-6 flex flex-col ${question.photo_upload?.[0]?.image_secure_url ? "md:flex-row items-center" : "text-center"
                        }`}
                >
                    {/* Text Content */}
                    <div className={`space-y-4 ${question.photo_upload?.[0]?.image_secure_url ? "md:w-1/2" : ""}`}>
                        <h1 className="text-5xl font-extrabold leading-tight">{question.title}</h1>
                        <p className="text-xl font-light text-gray-200">{question.description}</p>
                        <div className={`flex items-center justify-center ${question.photo_upload?.[0]?.image_secure_url ? "md:justify-start" : ""} text-sm space-x-4 mt-4`}>
                            <div className="flex items-center space-x-2">
                                <UserCircleIcon className="w-6 h-6 text-gray-300" />
                                <span>{`${question.postedBy.firstName} ${question.postedBy.lastName}`}</span>
                            </div>
                            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                
                    {/* Question Image */}
                    {question.photo_upload?.[0]?.image_secure_url && (
                        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
                            <img
                                src={question.photo_upload[0].image_secure_url}
                                alt="Question Visual"
                                className="w-full max-w-md rounded-lg shadow-lg transform transition duration-500 hover:scale-105"
                            />
                        </div>
                    )}
                </div>
            </div>



            {/* Answers Section */}
            <div className="max-w-5xl mx-auto mt-8 space-y-6 px-6">
                {answers.map((answer) => (
                    <div
                        key={answer._id}
                        className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition"
                    >
                        <div className="flex items-center mb-4">
                            <img
                                src={answer.postedBy.avatar || "/default-avatar.png"}
                                alt="User Avatar"
                                className="w-12 h-12 rounded-full border-2 border-gray-200"
                            />
                            <div className="ml-3">
                                <h3 className="font-semibold flex items-center text-gray-800">
                                    {`${answer.postedBy.firstName} ${answer.postedBy.lastName}`}
                                    {answer.postedBy.badges && (
                                        <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full flex items-center space-x-1">
                                            <CheckCircleIcon className="w-4 h-4" />
                                            <span>{answer.postedBy.badges[0]}</span>
                                        </span>
                                    )}
                                </h3>
                                <p className="text-xs text-gray-500">{new Date(answer.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <p className="text-gray-800 mb-4">{answer.answerBody}</p>
                        {answer.image && (
                            <div className="mt-4">
                                <img
                                    src={answer.image}
                                    alt="Answer visual"
                                    className="rounded-lg shadow-md w-full max-h-72 object-cover"
                                />
                            </div>
                        )}
                        <div className="flex items-center space-x-4 mt-4">
                            <button
                                className="flex items-center text-green-600 hover:text-green-800"
                                onClick={() => handleVote(answer._id, "upvote")}
                            >
                                <ArrowUpIcon className="w-5 h-5 mr-1" />
                                <span>{answer.votes.upvotes.length}</span>
                            </button>
                            <button
                                className="flex items-center text-red-600 hover:text-red-800"
                                onClick={() => handleVote(answer._id, "downvote")}
                            >
                                <ArrowDownIcon className="w-5 h-5 mr-1" />
                                <span>{answer.votes.downvotes.length}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Answer Section */}
            <div className="max-w-5xl mx-auto mt-12 bg-white p-8 shadow-lg rounded-lg px-6">
                <h2 className="text-lg font-semibold mb-4">Your Answer</h2>
                <textarea
                    rows="5"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Write your answer here..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button
                    onClick={handleAddAnswer}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg flex items-center space-x-2 hover:from-blue-600 hover:to-blue-700"
                >
                    <PencilSquareIcon className="w-5 h-5" />
                    <span>Submit</span>
                </button>
            </div>
        </div>
    );
};

export default SingleQuestionPage;
