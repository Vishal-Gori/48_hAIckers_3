// models/job.js

import mongoose from 'mongoose';

// Check if the model has already been defined
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
    }
  });

  // Define the Job model
  mongoose.model('Job', jobSchema);
}

// Export the Job model
export default mongoose.models.Job || mongoose.model('Job');
