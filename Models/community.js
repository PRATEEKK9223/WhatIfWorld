import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  result: { type: mongoose.Schema.Types.ObjectId, ref: 'Result', required: true },
  sharedAt: { type: Date, default: Date.now },
  // optional fields for future: author, comments, votes
});

const Community = mongoose.model('Community', communitySchema);

export default Community;
