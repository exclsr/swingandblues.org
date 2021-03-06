// views.js
//
// The design docs specific to our project.
var designDocs = require("./design-docs.js");

var rsvpDesignDoc = {
    url: '_design/rsvp',
    body: 
    {
        version: "1.0.2",
        language: "javascript",
        views: {
            'byEmail': {
                map: function (doc) {
                    if (doc.type === "rsvp" && doc.person) {
                        emit(doc.person.email, doc);
                    }
                }
            },
            'byName': {
                map: function (doc) {
                    if (doc.type === "rsvp" && doc.person) {
                        emit(doc.person.name, doc);
                    }
                }
            },
            'roles': {
                map: function(doc) {
                    if (doc.type && doc.type === "rsvp" && doc.person && doc.person.isAttending !== false) {
                        emit(doc.person.role, 1);
                    }
                },
                reduce: function(keys, values, rereduce) {
                    return sum(values);
                }
            }
        }
    }
};
designDocs.add(rsvpDesignDoc);

var paymentsDesignDoc = {
    url: '_design/payments',
    body: 
    {
        version: "1.0.0",
        language: "javascript",
        views: {
            'byEmail': {
                map: function (doc) {
                    if (doc.type === "payment") {
                        emit(doc.email, doc);
                    }
                }
            }
        }
    }
};
designDocs.add(paymentsDesignDoc);

var settingsDesignDoc = {
    url: '_design/settings',
    body: 
    {
        version: "1.0.0",
        language: "javascript",
        views: {
            'authorized': {
                map: function (doc) {
                    if (doc.type === "setting") {
                        if (doc.visibility === "public" 
                         || doc.visibility === "private") {
                            emit(doc.name, doc);
                        }
                        else if (doc.visibility === "secret") {
                            var setting = {};
                            for (var prop in doc) {
                                setting[prop] = doc[prop];
                            }
                            // Do not expose the value of secret settings
                            setting.value = undefined;
                            emit(doc.name, setting);
                        }
                    }
                }
            },
            'public': {
                map: function (doc) {
                    if (doc.type === "setting") {
                        if (doc.visibility === "public") {
                            emit(doc.name, doc);    
                        }
                    }
                }
            },
            'private': {
                map: function (doc) {
                    if (doc.type === "setting") {
                        if (doc.visibility === "private") {
                            emit(doc.name, doc);
                        }
                    }
                }
            },
            'all': {
                map: function (doc) {
                    if (doc.type === "setting") {
                        emit(doc.name, doc);    
                    }
                }
            }
        }
    }
};
designDocs.add(settingsDesignDoc);


var surveyDesignDoc = {
    url: '_design/survey',
    body: 
    {
        version: "1.0.1",
        language: "javascript",
        views: {
            'byTime': {
                map: function (doc) {
                    if (doc.type === "survey" && doc.meta && doc.meta.timestamp) {
                        emit(doc.meta.timestamp, {
                            overview: doc.overview,
                            music: doc.music,
                            meta: doc.meta,
                            things: {
                                howLongUnits: doc.things.howLongUnits,
                                'next-year': doc.things['next-year'],
                                socialDancingFor: doc.things.socialDancingFor,
                                'swing-feels': doc.things['swing-feels'],
                                'blues-feels': doc.things['blues-feels'],
                                bluesDancingFor: doc.things.bluesDancingFor,
                                swingDancingFor: doc.things.swingDancingFor,
                                'save-the-date': doc.things['save-the-date']
                            }
                        });
                    }
                }
            }
        }
    }
};
designDocs.add(surveyDesignDoc);



var createDesignDocs = function (database, callback) {
	designDocs.saveToDatabase(database, callback);
};

exports.create = createDesignDocs;