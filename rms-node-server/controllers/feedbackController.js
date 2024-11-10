const {Feedback } = require('../models/feedbackModel');

const feedbackController ={
    createFeedback :(req,res) =>{
        Feedback.create(req.body,(err,feedback)=>{
            if(err) return res.status(400).json({error:err.message})
            res.status(201).json(feedback)
        })
    },

    findAllFeedBack:(req,res) =>{
        Feedback.findAll((err,feedbacks)=>{
            if(err) return res.status(400).json({error:err.message})
            res.status(200).json(feedbacks)
        })
    },

    findFeedbackById : (req,res) =>{
        Feedback.fetchFeedback(req.params.feedbackid,(err,feedbacks)=>{
            if(err) return res.status(400).json({error:err.message})
            res.status(200).json(feedbacks)
        })
    },

    updateReaded :(req,res) =>{
        Feedback.updateReaded(req.params.feedbackid,(err)=>{
            if(err) return res.status(400).json({error :err.message})
            res.json({message:"Readed updated"})
        })
    },

    deleteFeedback:(req,res) =>{
        Feedback.delete(req.params.feedbackid,(err)=>{
            if(err) return res.status(400).json({error:err.message})
            res.json({message :"Feedback Deleted Successfully"})
        })
    }

}

module.exports = {feedbackController }