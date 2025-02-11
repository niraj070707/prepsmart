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

    const updateUserAnswer = async () => {
        console.log('userAnswer:', userAnswer);
        setLoading(true);

        try {
            // Log the feedback prompt for debugging
            const feedbackPrompt =
                'Question:  ' +
                questions[activeQuestionIndex]?.question +
                ', User answer: ' +
                userAnswer +
                ', Depends on question and user answer for given interview question please give us rating for answer and feedback as area of improvement if any, in just 3 to 5 lines to improve it in JSON format with rating field and feedback field';
            console.log('Feedback Prompt:', feedbackPrompt);

            // Fetch feedback from the API
            const result = await chatSession.sendMessage(feedbackPrompt);
            console.log('API Response:', result.response.text());

            // Parse the response
            const mockJsonResponse = result.response.text().replace(/```json|```/g, '').trim();
            console.log('Cleaned JSON Response:', mockJsonResponse);

            const parsedResponse = JSON.parse(mockJsonResponse);
            console.log('Parsed Feedback:', parsedResponse);

            // Save user answer to the database
            const response = await db.insert(UserAnswer).values({
                mockIdRef: interviewData?.mockId,
                question: questions[activeQuestionIndex]?.question,
                correctAnswer: questions[activeQuestionIndex]?.answer,
                userAnswer: userAnswer,
                feedback: parsedResponse?.feedback,
                rating: parsedResponse?.rating,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-yyyy'),
            });

            if (response) {
                toast.success('User Answer saved successfully');
            }
        } catch (error) {
            console.error('Error:', error);
            console.error('Error fetching feedback:', error);
            toast.error('Error fetching feedback. Please try again.');
        } finally {
            setLoading(false);
            setUserAnswer(''); // Reset user answer after saving
        }
        
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col mt-14 justify-center items-center py-10 px-14 rounded-lg bg-black">
                <Image src="/webcam.png" alt="alt" width={200} height={200} className="absolute" />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10,
                    }}
                />
            </div>

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
            <Button onClick={() => console.log('UserAns: ' + userAnswer)}>Show Answer</Button>
        </div>
    );
};

export default RecordAnswerSection;
