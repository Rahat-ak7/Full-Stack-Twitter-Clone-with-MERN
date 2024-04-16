import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      require: true,
    },
    like: {
      type: Array,
      default: [],
    },
    bookmarks: {
      type: Array,
      default: [],
    },
    // WHO WILL CREATE THE POST
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //   extended: true,
    },
    userDetails: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", tweetSchema);
export default Tweet;
