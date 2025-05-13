import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/geminiAiModel';

let useSpeechToText;
if (typeof window !== 'undefined') {
    useSpeechToText = require('react-hook-speech-to-text').default;
} else {
    useSpeechToText = () => ({ error: null, isRecording: false, results: [], startSpeechToText: () => {}, stopSpeechToText: () => {} });
}

import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { db } from '@/utils/db';

const RecordAnswerSection = ({ interviewData, mockInterviewQuestion, activeQuestionIndex }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const questions = mockInterviewQuestion || [];
    console.log('Questions:', questions);

    const {
        setResults,
        error,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({ continuous: true, useLegacyResults: false });

    // Update userAnswer whenever results change
    useEffect(() => {
        const newAnswer = results.map((result) => result?.transcript).join(' ');
        setUserAnswer(newAnswer);
    }, [results]);

    // Handle errors from useSpeechToText
    useEffect(() => {
        if (error) {
            toast.error('Error accessing microphone. Please check permissions.');
            console.error('Speech-to-text error:', error);
        }
    }, [error]);

    useEffect(()=>{
        if(!isRecording&&userAnswer.length>10){
             updateUserAnswer();
        }
    },[userAnswer])

    const startStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText(); // Stop recording
            console.log("userAns : ",userAnswer);
        } else {
            startSpeechToText(); // Start recording
        }
    };

    // const updateUserAnswer = async () => {
    //     console.log('userAnswer:', userAnswer);
    //     setLoading(true);

    //     try {
    //         // Log the feedback prompt for debugging
    //         const feedbackPrompt =
    //             'Question:  ' +
    //             questions[activeQuestionIndex]?.question +
    //             ', User answer: ' +
    //             userAnswer +
    //             ', Depends on question and user answer for given interview question please give us rating for answer and feedback as area of improvement if any, in just 3 to 5 lines to improve it in JSON format with rating field and feedback field';
    //         console.log('Feedback Prompt:', feedbackPrompt);

    //         // Fetch feedback from the API
    //         const result = await chatSession.sendMessage(feedbackPrompt);
    //         console.log('API Response:', result.response.text());

    //         // Parse the response
    //         const mockJsonResponse = result.response.text().replace(/```json|```/g, '').trim();
    //         console.log('Cleaned JSON Response:', mockJsonResponse);

    //         const parsedResponse = JSON.parse(mockJsonResponse);
    //         console.log('Parsed Feedback:', parsedResponse);

    //         // Save user answer to the database
    //         const response = await db.insert(UserAnswer).values({
    //             mockIdRef: interviewData?.mockId,
    //             question: questions[activeQuestionIndex]?.question,
    //             correctAnswer: questions[activeQuestionIndex]?.answer,
    //             userAnswer: userAnswer,
    //             feedback: parsedResponse?.feedback,
    //             rating: parsedResponse?.rating,
    //             userEmail: user?.primaryEmailAddress?.emailAddress,
    //             createdAt: moment().format('DD-MM-yyyy'),
    //         });

    //         if (response) {
    //             toast.success('User Answer saved successfully');
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         console.error('Error fetching feedback:', error);
    //         toast.error('Error fetching feedback. Please try again.');
    //     } finally {
    //         setLoading(false);
    //         setUserAnswer(''); // Reset user answer after saving
    //         setResults([]);
    //     }
        
    // };

    const updateUserAnswer = async () => {
        console.log('userAnswer:', userAnswer);
        
        // Validate we have required data
        if (!userAnswer || !questions[activeQuestionIndex]?.question) {
            toast.error('Please provide an answer before submitting');
            return;
        }
    
        setLoading(true);
    
        try {
            // Construct detailed feedback prompt
            const feedbackPrompt = `
    You are an expert interviewer evaluating a candidate's response to an interview question. 
    Please provide specific, constructive feedback in JSON format with the following structure:
    {
      "rating": number (1-10, where 1=Poor, 5=Average, 10=Excellent),
      "feedback": string (3-5 specific bullet points of constructive feedback write in single string not array)
    }
    
    Question: ${questions[activeQuestionIndex]?.question}
    User's Answer: ${userAnswer}
    
    Evaluation Criteria:
    1. Accuracy (is the answer technically correct?)
    2. Completeness (does it cover all aspects of the question?)
    3. Clarity (is the response well-structured and easy to understand?)
    4. Relevance (does it stay focused on the question?)
    5. Depth (does it demonstrate advanced knowledge where appropriate?)
    
    Provide only the JSON response, no additional commentary or formatting.
    `;
            console.log('Feedback Prompt:', feedbackPrompt);
    
            // Fetch feedback from the API
            const result = await chatSession.sendMessage(feedbackPrompt);
            const responseText = result.response.text();
            console.log('API Response:', responseText);
    
            // Clean and parse the response
            const cleanedResponse = responseText.replace(/```json|```/g, '').trim();
            console.log('Cleaned JSON Response:', cleanedResponse);
    
            const parsedResponse = JSON.parse(cleanedResponse);
            console.log('Parsed Feedback:', parsedResponse);
    
            // Validate the response structure
            if (!parsedResponse.rating || !parsedResponse.feedback) {
                throw new Error('Invalid feedback structure from API');
            }
            if (parsedResponse.rating < 1 || parsedResponse.rating > 5) {
                throw new Error('Rating out of bounds (1-5)');
            }
    
            // Save user answer to the database
            const response = await db.insert(UserAnswer).values({
                mockIdRef: interviewData?.mockId,
                question: questions[activeQuestionIndex]?.question,
                correctAnswer: questions[activeQuestionIndex]?.answer,
                userAnswer: userAnswer,
                feedback: parsedResponse.feedback,
                rating: parsedResponse.rating,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-yyyy'),
            });
    
            if (response) {
                toast.success('Your answer and feedback were saved successfully');
            }
        } catch (error) {
            console.error('Error in updateUserAnswer:', error);
            
            let errorMessage = 'Error processing your answer. Please try again.';
            if (error instanceof SyntaxError) {
                errorMessage = 'We received an invalid feedback format. Please try again.';
            } else if (error.message.includes('feedback structure')) {
                errorMessage = 'The feedback service returned incomplete data.';
            } else if (error.message.includes('Rating out of bounds')) {
                errorMessage = 'Received an invalid rating value. Please try again.';
            }
            
            toast.error(errorMessage);
        } finally {
            setLoading(false);
            setUserAnswer(''); // Reset user answer after saving
            setResults([]);
        }
    };

    return (
        <div className="flex text-gray-700 flex-col justify-center items-center">
            <Button disabled={loading} variant="outline" className="mt-10 mb-5" onClick={startStopRecording}>
                {isRecording ? (
                    <h2 className="text-red-600 animate-pulse flex gap-3">
                        <StopCircle /> Stop Recording....
                    </h2>
                ) : (
                    <h2 className="flex gap-3">
                        <Mic /> Record Answer
                    </h2>
                )}
            </Button>
            {/* <Button onClick={() => console.log('UserAns: ' + userAnswer)}>Show Answer</Button> */}
        </div>
    );
};

export default RecordAnswerSection;
