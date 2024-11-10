const db = require('../config/database');
const uuid = require('uuid')
const moment = require('moment')

const Feedback ={
    create : (feedback,callback) =>{
    const { userid,postid,reason,comments} = feedback;
    const feedbackid = uuid.v4();
    const createdOn = moment().format('L')
    const readed = false;
    db.run(`INSERT INTO FEEDBACK(feedbackid,userid,postid,reason,comments,createdOn,readed) VALUES 
    (?,?,?,?,?,?,?)`,[feedbackid,userid,postid,reason,comments,createdOn,readed],(err)=>{
        if(err)  return callback(err);
        callback(null,{feedbackid})
    })
    },
    
    findAll :(callback) =>{
        db.all(`SELECT * FROM FEEDBACK`,[],(err,rows)=>{
            callback(err,rows)
        })
    },

    delete : (feedbackid,callback) =>{
        db.run(`DELETE FROM FEEDBACK WHERE feedbackid=?`,[feedbackid],(err)=>{
            if(err) return callback(err)
            callback(null)
        })
    },

    updateReaded :(feedbackid,callback) =>{
        db.run(`UPDATE FEEDBACK SET readed=1 WHERE feedbackid =?`,[feedbackid],(err)=>{
            if(err) return callback(err)
                callback(null)
        })
    },

    fetchFeedback : (feedbackid,callback) =>{
        db.run(`SELECT f.feedbackid,f.reason, f.comments,f.priority,f.createdOn, f.readed, u.userid,u.username,
      p.postid,p.postName,p.AdditionalName FROM FEEDBACK f JOIN user u ON f.userid = u.userid JOIN 
      post p ON f.postid = p.postid WHERE f.feedbackid =?`,[feedbackid],(err,rows)=>{
        callback(err,rows)
      })
    }


}

module.exports = { Feedback};