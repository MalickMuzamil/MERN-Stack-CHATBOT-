import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const blogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: { type: String, required: true },              // User ka original prompt/question
    messages: [messageSchema],                             // Conversation history
    isFinal: { type: Boolean, default: false },           // Conversation complete hone ka flag
}, { timestamps: true });

const BlogModel = mongoose.model("tbl_blog", blogSchema);
export default BlogModel;
