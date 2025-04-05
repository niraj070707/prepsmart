import { Button } from '@/components/ui/button'
import { db } from '@/utils/db';
import { MockInterview, UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';
import React from 'react'

const InterviewItemCard = ({ interview }) => {
    const router = useRouter();

    const onStart=()=>{
        router.push(`/dashboard/interview/${interview.mockId}`)
    }
    const onFeedbackPress=()=>{
        router.push(`/dashboard/interview/${interview.mockId}/feedback`)
    }

    const onDeleteMockInterview = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this mock interview?');
        if (!confirmDelete) return;
    
        try {
            await db.delete(UserAnswer).where(eq(UserAnswer.mockIdRef, interview?.mockId));
            await db.delete(MockInterview).where(eq(MockInterview.mockId, interview?.mockId));
            alert('Mock interview deleted successfully');
            router.refresh(); // Refresh the page
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete mock interview');
        }
    };

    return (
        <div className='border flex flex-col shadow-sm rounded-lg p-3'>
            <div className=' flex justify-between'>
                <h2 className='font-bold text-blue-600'>{interview?.jobPosition}</h2>
                <h2 onClick={onDeleteMockInterview} className='cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#d34242"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg></h2>
            </div>
            
            <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of Experience</h2>
            <h2 className='text-xs text-gray-400'>Created At: {interview?.createdAt}</h2>

            <div className='flex justify-between mt-2 gap-5'>
                <Button onClick={onFeedbackPress} size='sm' variant="outline" className='w-full text-gray-700 bg-gray-200'>Feedback</Button>
                <Button onClick={onStart} size='sm' className='w-full'>Start</Button>
            </div>
        </div>
    )
}

export default InterviewItemCard