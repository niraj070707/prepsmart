import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const MockInterview=pgTable('mockInterview', {
    id:serial('id').primaryKey(),
    noOfQuestions:integer('noOfQuestion').notNull(),
    jsonMockResp:text('jsonMockResp').notNull(),
    jobPosition:varchar('jobPosition').notNull(),
    jobDesc:varchar('jobDesc').notNull(),
    jobExperience:varchar('jobExperience').notNull(),
    createdBy:varchar('createdBy').notNull(),
    createdAt:varchar('createdAt'),
    mockId:varchar('mockId').notNull()
})

export const UserAnswer=pgTable('userAnswer',{
    id:serial('id').primaryKey(),
    mockIdRef:varchar('mockId').notNull(),
    question:varchar('question').notNull(),
    correctAnswer:text('correctAnswer'),
    userAnswer:text('userAnswer'),
    feedback:text('feedback'),
    rating:varchar('rating'),
    emotionFeedback:text('emotionFeedback'),
    userEmail:varchar('userEmail'),
    createdAt:varchar('createdAt'),
})