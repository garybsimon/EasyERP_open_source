﻿var access = function (models) {
    'use strict';
    var mongoose = require('mongoose');
    var profile = mongoose.Schemas.Profile;
    var userSchema = mongoose.Schemas.Users;

    var getAccess = function (req, uId, mid, callback) {
        models.get(req.session.lastDb, 'Users', userSchema).findById(uId, function (err, user) {
            if (user) {
                models.get(req.session.lastDb, 'Profile', profile).aggregate(
                    {
                        $project: {
                            profileAccess: 1
                        }
                    },
                    {
                        $match: {
                            _id: user.profile
                        }
                    },
                    {
                        $unwind: '$profileAccess'
                    },

                    {
                        $match: {
                            'profileAccess.module': mid
                        }
                    }, function (_err, result) {
                        return callback({error: _err, result: result});
                    }
                );
            } else {
                callback({error: 'access.js users.findById error'});
            }
        });
    };

    var getReadAccess = function (req, uId, mid, callback) {
        getAccess(req, uId, mid, function (res) {
            if (res.error) {
                console.log(res.error);
            } else {
                callback(res.result[0].profileAccess.access.read);
            }
        });
    };
    var getEditWritAccess = function (req, uId, mid, callback) {
        getAccess(req, uId, mid, function (res) {
            if (res.error) {
                console.log(res.error);
            } else {
                callback(res.result[0].profileAccess.access.editWrite);
            }
        });

    };
    var getDeleteAccess = function (req, uId, mid, callback) {
        getAccess(req, uId, mid, function (res) {
            if (res.error) {
                console.log(res.error);
            } else {
                callback(res.result[0].profileAccess.access.del);
            }
        });
    };

    var getApproveAccess = function (req, uId, mid, callback) {
        getAccess(req, uId, mid, function (res) {
            if (res.error) {
                console.log(res.error);
            } else {
                //todo - refactor
                callback(true);
            }
        });
    };

    return {
        getReadAccess    : getReadAccess,
        getEditWritAccess: getEditWritAccess,
        getDeleteAccess: getDeleteAccess,
        getApproveAccess: getApproveAccess
    }
};
module.exports = access;
