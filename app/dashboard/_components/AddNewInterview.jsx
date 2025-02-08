"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/dialog'
import React from 'react'

const AddNewInterview = () => {
  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shdow-md cursor-pointer transition-all'>
        <h2 className='font-semibold text-lg text-center'>+ Add new</h2>
      </div>

      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default AddNewInterview
