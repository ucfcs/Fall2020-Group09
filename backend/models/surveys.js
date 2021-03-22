const mongoose = require('mongoose')

const Date = mongoose.Schema.Types.Date
const ObjectId = mongoose.Schema.Types.ObjectId

const survey_schema = mongoose.Schema({
    
    title:String,
    
    project: {
        type: ObjectId,
        required: true
    },
    researchers: [{
        type: ObjectId,
        required: true,
        ref: 'Users'
    }],

    maxResearchers:{
        type: Number,
        required: true,
        default: 1
    },

    sharedData:{
        type: ObjectId,
        ref: 'Stationary_Collections',
        required: true
    },

    date:{
        type: Date,
        required: true
    },

    key:{
        type: String,
        unique: true
    }   
})


const Surveys = module.exports = mongoose.model('Surveys', survey_schema)

module.exports.addSurvey = async function(newSurvey) {
    newSurvey.key = "Placeholder Key"
    return await newSurvey.save()
}

module.exports.updateSurvey = async function (projectId, newSurvey) {
    return await Surveys.updateOne(
        { _id: projectId },
        { $set: {
            title: newSurvey.title,
            date: newSurvey.date,
            maxResearchers: newSurvey.maxResearchers,
        }}
    )
}

module.exports.deleteSurvey = async function(surveyId) {
    return await Surveys.findByIdAndDelete(surveyId)
}

module.exports.projectCleanup = async function(projectId) {
    return await Surveys.deleteMany({ project: projectId })
}

module.exports.addResearcher = async function(surveyId, userId){
    return await Surveys.updateOne(
        { _id: surveyId },
        { $push: { researchers: userId}}
    )
}

module.exports.removeResearcher = async function(surveyId, userId){
    return await Surveys.updateOne(
        { _id: surveyId },
        { $pull: { researchers: userId}}
    )
}

module.exports.isResearcher = async function(surveyId, userId){
    try{
        const doc = await Surveys.find(
            {
                _id: surveyId, 
                researchers: { $elemMatch:  userId }
            }
        )
    }catch(error){
        return false
    }
    if (doc.length === 0) {
        return false
    }
    return true
}