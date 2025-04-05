"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/utils/db";
import { chatSession } from "@/utils/geminiAiModel";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const AddNewInterview = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [noOfQuestions, setNoOfQuestions] = useState(3);
    const [jobExperience, setJobExperience] = useState(0);
    const [loading, setLoading] = useState(false);
    const [jsonResponce, setJsonResponse] = useState('');
    const user = useUser();
    const router = useRouter();

    const onSubmit = async (ev) => {
        ev.preventDefault();
        setLoading(true);

        try {
            // Construct the input prompt
            const inputPrompt = `Job position: ${jobPosition} Job description: ${jobDescription} Job experience: ${jobExperience} years, Using this information give us ${noOfQuestions} interview questions along with  answer text and return the result in JSON format.This json format has key value pair value should be a single string. Also, make sure it will parse easily in JSON. And give respone as array of object as each object has keys questions, answers and other if needed,please check on your side that it easily parsed`;

            // Send the prompt to the chat session
            const result = await chatSession.sendMessage(inputPrompt);
            const mockJsonResponse = result.response.text().replace(/```json|```/g, '').trim();

            // Attempt to parse the JSON response
            try {
                const parsedResponse = JSON.parse(mockJsonResponse);
                console.log("Parsed Response:", parsedResponse);

                // Set the JSON response in state
                setJsonResponse(mockJsonResponse);

                // If the response is valid, save it to the database
                if (mockJsonResponse) {
                    const response = await db.insert(MockInterview).values({
                        mockId: uuidv4(),
                        noOfQuestions: noOfQuestions,
                        jobPosition: jobPosition,
                        jobDesc: jobDescription,
                        jobExperience: jobExperience,
                        jsonMockResp: mockJsonResponse,
                        createdBy: user?.user?.primaryEmailAddress?.emailAddress,
                        createdAt: moment().format('DD-MM-yyyy'),
                    }).returning({ mockId: MockInterview.mockId });

                    router.push(`/dashboard/interview/${response[0].mockId}`);
                }
            } catch (parseError) {
                console.error("Failed to parse JSON:", parseError);
                throw new Error("Failed to parse the response as JSON.");
            }
        } catch (error) {
            console.error("Error during onSubmit:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <div className="flex items-center justify-center bg-[#111233] border border-blue-500 rounded-lg">
                    <DialogTrigger asChild>
                        <div
                            className="flex items-center justify-center p-10 rounded-lg hover:scale-105 hover:shadow-md cursor-pointer transition-all"
                            onClick={() => setOpenDialog(true)}
                        >
                            <Button className="text-blue-500 bg-grey px-2 py-2 rounded">+ Add new</Button>
                        </div>
                    </DialogTrigger>
                </div>

                <DialogContent className="bg-[#100D28] max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-bold text-2xl text-white">Tell us more about your job interviewing</DialogTitle>
                        <form onSubmit={onSubmit}>
                            <div className="text-sm text-muted-foreground">
                                <h2 className="text-[#EFEFEF]">
                                    Add details about your job position/role, job description, and
                                    years of experience
                                </h2>
                                <div className="mt-7 my-3 space-y-4">
                                    <div>
                                        <Label className="block text-sm font-small text-[#EFEFEF]">Job Role/Position</Label>
                                        <Input className="text-white" onChange={(ev) => setJobPosition(ev.target.value)} placeholder="Ex. Full Stack Developer" required />
                                    </div>
                                </div>
                                <div className="my-3 space-y-4">
                                    <div>
                                        <Label className="block text-sm font-medium text-[#EFEFEF]">Job Description/Tech Stack (In short)</Label>
                                        <Textarea className="text-white" onChange={(ev) => setJobDescription(ev.target.value)} placeholder="Ex. React, Angular, NodeJs, Postgresql" required />
                                    </div>
                                </div>
                                <div className="my-3 space-y-4">
                                    <div>
                                        <Label className="block text-sm font-medium text-[#EFEFEF]">Years of experience</Label>
                                        <Input className="text-white" onChange={(ev) => setJobExperience(ev.target.value)} placeholder="Ex. 2" type="number" required max={75} />
                                    </div>
                                </div>
                                <div className="my-3 space-y-4">
                                    <div>
                                        <Label className="block text-sm font-medium text-[#EFEFEF]">Number of Questions</Label>
                                        <Input className="text-white"
                                            onChange={(ev) => setNoOfQuestions(ev.target.value)}
                                            placeholder="Ex. 3"
                                            type="number"
                                            required
                                            min={1}
                                            max={10}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-5 justify-end mt-6">
                                    <Button className="text-black bg-slate-200 px-4 py-2 rounded border border-blue-500" type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                                        Close
                                    </Button>
                                    <Button className="text-blue-500 bg-white px-4 py-2 rounded border border-blue-500" type="submit" disabled={loading}>
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <LoaderCircle className="animate-spin" />
                                                Generating From AI
                                            </span>
                                        ) : 'Start Interview'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddNewInterview;