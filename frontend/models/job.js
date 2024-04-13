// models/job.js

import mongoose from 'mongoose';

if (!mongoose.models.Job) {
  const jobSchema = new mongoose.Schema({
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    jobTitle: {
      type: String,
      required: true
    },
    jobDescription: {
      type: String,
      required: true
    },
    category:{
      type: String,
      required:true
    },
    experience:{
      type:Number,
      required:true
    },
    salary:{
      type:Number,
      required:true
    },
    skills:{
      type:String,
      required:true
    }
  });

  mongoose.model('Job', jobSchema);
}

// Export the Job model
export default mongoose.models.Job || mongoose.model('Job');
