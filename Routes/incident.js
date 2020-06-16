const express = require('express');
const incidentRout = express.Router();
const incidentDB = require('../Models/incidentSchema');
const cors = require('cors');
incidentRout.use(cors());


//Display all the records that matches the search parameter
incidentRout.get('/params', (req, res) => {
    let params = req.query.params;
    incidentDB.find({ "$text": { "$search": params } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } })
        .then(Incidents => {
            res.send(Incidents);
        }).catch(err => {
            res.json({
                'Success': false,
                'Error': err
            });
        });
});


//Display all the records
incidentRout.get('/All', (req, res) => {
    incidentDB.find()
        .then(Incidents => {
            res.send(Incidents);
        }).catch(err => {
            res.json({
                'Success': false,
                'Error': err
            });
        });
});


//Update the fields in the reported incident
incidentRout.put('/update', (req, res) => {
    let params = { _id: req.body.ID };
    try {
        incidentDB.findOne(params, function(err, foundobj) {
            if (err) {
                res.json({
                    'Success': false,
                    'Error': err
                });
            } else {
                if (!foundobj) {
                    res.json({
                        'Success': false,
                        'Error': "Record not found"
                    });
                } else {
                    foundobj.Date = req.body.editData.Date;
                    foundobj.IA = req.body.editData.IA;
                    foundobj.IR = req.body.editData.IR;
                    foundobj.Severity = req.body.editData.Severity;
                    foundobj.FunctionalArea = req.body.editData.FunctionalArea;
                    foundobj.ReportedBy = req.body.editData.ReportedBy;
                    foundobj.ProblemReported = req.body.editData.ProblemReported;
                    foundobj.RootCause = req.body.editData.RootCause;
                    foundobj.ActionResolutionWorkaround = req.body.editData.ActionResolutionWorkaround;
                    foundobj.LongTermSolutionNeeded = req.body.editData.LongTermSolutionNeeded;
                    foundobj.RedirectedtoOtherTeams = req.body.editData.RedirectedtoOtherTeams;
                    foundobj.Timetakentoresolvetheproblem = req.body.editData.Timetakentoresolvetheproblem;
                    foundobj.Team = req.body.editData.Team;
                    foundobj.LastModifiedBy = req.body.editData.LastModifiedBy;
                    foundobj.LastModifiedDate = req.body.editData.LastModifiedDate;
                    foundobj.save(function(err, updatedobj) {
                        if (err) {
                            res.json({
                                'Success': false,
                                'Error': err
                            });
                        } else {
                            res.json({
                                'Success': true,
                                'Error': 'Updated successfully'
                            });
                        }
                    })
                }
            }
        })
    } catch (err) {
        res.json({
            'Success': false,
            'Error': err
        });
    }
});


//Add the reported incident
incidentRout.post('/insert', (req, res) => {
    incidentDB.insertMany(req.body.newData).then((docs) => {
        res.json({
            'Success': true,
            'Error': 'Added successfuly'
        });
    }).catch((err) => {
        res.json({
            'Success': false,
            'Error': err
        });
    })
});


//Delete the reported incident
incidentRout.delete('/delete', (req, res) => {

    let params = { _id: req.query.params }; // Query to find the correct record.
    incidentDB.findOne(params, function(err, foundobj) {
        if (err) {
            res.json({
                'Success': false,
                'Error': err
            });
        } else {
            foundobj.delete(function(err, deltedobj) {
                if (err) {
                    res.json({
                        'Success': false,
                        'Error': err
                    });
                } else {
                    res.json({
                        'Success': true,
                        'Error': 'Deleted successfully'
                    });
                }
            })
        }

    })
});

module.exports = incidentRout;