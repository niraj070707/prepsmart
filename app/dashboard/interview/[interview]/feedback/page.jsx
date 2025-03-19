"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const Feedback = ({ params }) => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const router = useRouter();
    
    useEffect(() => {
        GetFeedback();
    }, []);

    const GetFeedback = async () => {
        try {
            const result = await db
                .select()
                .from(UserAnswer)
                .where(eq(UserAnswer.mockIdRef, params.interview))
                .orderBy(UserAnswer.id);
            
            setFeedbackList(result);
            console.log("Feedback:", result);

            if (result.length > 0) {
                const totalRating = result.reduce((sum, item) => sum + (Number(item.rating) || 0), 0);
                setAverageRating((totalRating / result.length).toFixed(1)); // Keep one decimal place
            } else {
                setAverageRating(null); // No feedback available
            }
        } catch (error) {
            console.error("Failed to fetch feedback:", error);
        }
    };

    return (
        <div className='p-10'>
            <h2 className='text-3xl font-bold text-green-500'>Congratulations</h2>
            <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
            <h2 className='text-primary text-lg my-3'>
                Your overall interview rating: <strong>{averageRating !== null ? `${averageRating}/10` : `0/10`}</strong>
            </h2>

            <h2 className='text-sm text-gray-500'>
                Interview question with correct answers and feedback for improvement
            </h2>

            {feedbackList.map((item, index) => (
                <Collapsible className='my-7' key={index}>
                    <CollapsibleTrigger className='gap-7 p-2 bg-secondary rounded-lg my-2 text-left flex justify-between'>
                        Question {index + 1} <ChevronsUpDown className='h-5 w-5' />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className='flex flex-col gap-3'>
                            <p className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong> {item.rating || "N/A"}</p>
                            <p className='p-2 text-gray-500'><strong>Question:</strong> {item.question}</p>
                            <p className='p-2 border rounded-lg bg-red-50 text-red-900'><strong>Your Answer:</strong> {item.userAnswer}</p>
                            <p className='p-2 border rounded-lg bg-green-50 text-green-900'><strong>Correct Answer:</strong> {item.correctAnswer}</p>
                            <p className='p-2 border rounded-lg bg-blue-50 text-blue-900'><strong>Feedback:</strong> {item.feedback}</p>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            ))}

            <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
        </div>
    );
};

export default Feedback;
