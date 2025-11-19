import mongoose from 'mongoose';


const commentSchema=new mongoose.Schema({
  text:{
    type:String,
    required:true,
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const communitySchema = new mongoose.Schema({
  result: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Result',
    required: true 
},
  sharedAt: { 
    type: Date, 
    default: Date.now 
},
  // optional fields for future: author, comments, votes
  author:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    
  },
  likes:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    }
  ],
  comments:[commentSchema],
  views:{
    type:Number,
    default:0,
  },
  viewedIPs:{
    type:[String],
    default:[],
  },
  trendingScore:{
    type:Number,
    default:0,
  }
});

const Community = mongoose.model('Community', communitySchema);

export default Community;