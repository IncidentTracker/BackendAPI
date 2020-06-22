const mongooseOnCall = require('mongoose');

var callTrackerSchema = mongooseOnCall.Schema([{

    Date: String,
    IA: String,
    IR: String,
    Severity: Number,
    FunctionalArea: String,
    ReportedBy: String,
    ProblemReported: String,
    RootCause: String,
    ActionResolutionWorkaround: String,
    LongTermSolutionNeeded: String,
    RedirectedtoOtherTeams: String,
    Timetakentoresolvetheproblem: String,
    Team: String,
    LastModifiedBy: String,
    LastModifiedDate: Date
}]);

callTrackerSchema.index({ '$**': 'text' });
module.exports = mongooseOnCall.model('Oncall', callTrackerSchema);