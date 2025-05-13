"use client"
import { db } from '@/utils/db';
import { MockInterview, UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState, useRef, useCallback } from 'react'
import QustionsSection from './_components/QustionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Webcam from 'react-webcam';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useUser } from '@clerk/nextjs';

const StartInterview = ({ params }) => {
    const router = useRouter();
    const [interviewData, setInterviewData] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [interviewQuestion, setInterviewQuestion] = useState([]);
    const [DEFAULT_INTERVIEW_DURATION, setDID] = useState(localStorage.getItem(`noOfQuestions_${params?.interview}`) * 3 * 60 * 1000);
    const [timeRemaining, setTimeRemaining] = useState(DEFAULT_INTERVIEW_DURATION);
    const [timerActive, setTimerActive] = useState(true);
    const [snapshots, setSnapshots] = useState([]);
    const [isCapturing, setIsCapturing] = useState(false);

    const webcamRef = useRef(null);
    const captureIntervalRef = useRef(null);
    const snapshotCountRef = useRef(0);
    const user = useUser();

    useEffect(() => {
        if (params.interview) {
            GetInterviewDetails();
            initializeTimer();
        }

        return () => {
            // Clean up intervals when component unmounts
            if (window.timerInterval) {
                clearInterval(window.timerInterval);
            }
            if (captureIntervalRef.current) {
                clearInterval(captureIntervalRef.current);
            }
        };
    }, [params.interview]);

    const startSnapshotCapture = useCallback(() => {
        if (captureIntervalRef.current) {
            clearInterval(captureIntervalRef.current);
        }

        setIsCapturing(true);
        // Capture every 5 seconds
        captureIntervalRef.current = setInterval(() => {
            captureSnapshot();
        }, 5000);
    }, []);

    const stopSnapshotCapture = useCallback(() => {
        if (captureIntervalRef.current) {
            clearInterval(captureIntervalRef.current);
            captureIntervalRef.current = null;
        }
        setIsCapturing(false);
    }, []);

    const captureSnapshot = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                const timestamp = new Date().toISOString();
                const snapshot = {
                    id: snapshotCountRef.current++,
                    data: imageSrc,
                    timestamp,
                    questionIndex: activeQuestionIndex
                };
                setSnapshots(prev => [...prev, snapshot]);
            }
        }
    }, [activeQuestionIndex]);

    const initializeTimer = () => {
        // Check if there's an existing timer in localStorage
        const storedEndTime = localStorage.getItem(`interviewTimer_${params.interview}`);
        const now = new Date().getTime();

        if (storedEndTime) {
            const remaining = parseInt(storedEndTime) - now;
            if (remaining > 0) {
                setTimeRemaining(remaining);
                startTimer(remaining);
                startSnapshotCapture(); // Start capturing if timer was already running
            } else {
                // Time's up, redirect to feedback
                handleTimeExpired();
            }
        } else {
            // No existing timer, start a new one
            const endTime = now + DEFAULT_INTERVIEW_DURATION;
            localStorage.setItem(`interviewTimer_${params.interview}`, endTime.toString());
            setTimeRemaining(DEFAULT_INTERVIEW_DURATION);
            startTimer(DEFAULT_INTERVIEW_DURATION);
            startSnapshotCapture(); // Start capturing for new interview
        }
    };

    const startTimer = (duration) => {
        // Clear any existing interval
        if (window.timerInterval) {
            clearInterval(window.timerInterval);
        }

        // Set up new interval
        window.timerInterval = setInterval(() => {
            setTimeRemaining(prev => {
                const newTime = prev - 1000;
                if (newTime <= 0) {
                    clearInterval(window.timerInterval);
                    handleTimeExpired();
                    return 0;
                }
                return newTime;
            });
        }, 1000);
    };

    const createSnapshotZip = async () => {
        const zip = new JSZip();
        const imagesFolder = zip.folder("images");

        // Add each snapshot to the zip
        snapshots.forEach((snapshot, index) => {
            // Extract base64 data from the screenshot
            const base64Data = snapshot.data.replace(/^data:image\/\w+;base64,/, '');
            imagesFolder.file(`snapshot_${snapshot.questionIndex}_${index}.png`, base64Data, { base64: true });
        });

        // Generate the zip file
        const content = await zip.generateAsync({ type: "blob" });
        return content;
    };

    const handleTimeExpired = async () => {
        stopSnapshotCapture();
        setTimerActive(false);

        try {
            const zipBlob = await createSnapshotZip();
            saveAs(zipBlob, `interview_snapshots_${params.interview}.zip`);

            const formData = new FormData();
            formData.append('zipfile', zipBlob, `interview_snapshots_${params.interview}.zip`);

            const uploadResponse = await fetch('http://localhost:4000/upload', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (!uploadResponse.ok) {
                throw new Error(`Upload failed: ${uploadResponse.statusText}`);
            }

            const analysisResult = await uploadResponse.json();
            console.log("Analysis result:", analysisResult);

            const re = await db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef, params?.interview));
            console.log('re.................................................................... : ', re);
            // Update database
            const result = await db
                .update(UserAnswer)
                .set({
                    emotionFeedback: JSON.stringify(analysisResult)
                })
                .where(eq(UserAnswer.mockIdRef, params?.interview));

            console.log("Update result:", result); // Log ORM output

        } catch (error) {
            console.error("Error in handleTimeExpired:", error);
        }

        localStorage.removeItem(`interviewTimer_${params.interview}`);
        localStorage.removeItem(`noOfQuestions_${params.interview}`);
        router.push(`/dashboard/interview/${interviewData?.mockId}/feedback`);
    };

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const GetInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interview));

            if (result.length > 0) {
                setInterviewData(result[0]);
                const jsonMockResp = await JSON.parse(result[0].jsonMockResp);
                setInterviewQuestion(jsonMockResp);
            } else {
                console.log("No interview data found");
            }
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    };

    return (
        <div>
            {/* Timer Display */}
            <div className="flex justify-center mt-3 z-50">
                <div className="text-lg bg-transparent border rounded-lg p-4 shadow-lg font-semibold">
                    Time Remaining: {formatTime(timeRemaining)}
                </div>
            </div>

            <div className='mb-8 grid grid-cols-1 md:grid-cols-2 gap-10'>
                <QustionsSection
                    mockInterviewQuestion={interviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                />
                <div>
                    <div className="flex flex-col mt-14 justify-center items-center py-10 px-14 rounded-lg bg-black">
                        <div></div>
                        <Image
                            src="/webcam.png"
                            alt="alt"
                            width={200}
                            height={200}
                            className="absolute"
                            style={{ display: isCapturing ? 'none' : 'block' }}
                        />
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/jpeg"
                            mirrored={true}
                            style={{
                                height: 300,
                                width: '100%',
                                zIndex: 10,
                                display: isCapturing ? 'block' : 'none'
                            }}
                        />
                    </div>
                    <RecordAnswerSection
                        interviewData={interviewData}
                        mockInterviewQuestion={interviewQuestion}
                        activeQuestionIndex={activeQuestionIndex}
                    />
                </div>
            </div>
            <div className='mb-5 gap-7 flex justify-end'>
                {activeQuestionIndex > 0 && <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>}
                {activeQuestionIndex !== (interviewQuestion?.length - 1) && (
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>
                )}
                {activeQuestionIndex === (interviewQuestion?.length - 1) && (
                    <Button onClick={handleTimeExpired}>
                        End Interview
                    </Button>
                )}
            </div>

            {/* Debug view (optional) - shows count of captured snapshots */}
            <div className="mt-4 text-sm text-gray-500">
                Captured {snapshots.length} snapshots
            </div>
        </div>
    );
}

export default StartInterview;