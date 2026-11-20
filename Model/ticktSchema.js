
// const mongoose = require("mongoose");

// const ticketSchema = new mongoose.Schema(
//     {
//         title: {
//             type: String,
//             required: true,
//             trim: true
//         },

//         description: {
//             type: String,
//             required: true,
//             trim: true
//         },

//         category: {
//             type: String,
//             enum: ["Hardware", "Software", "Network", "Other"],
//             required: true
//         },

//         priority: {
//             type: String,
//             enum: ["Low", "Medium", "High"],
//             default: "Medium"
//         },

//         status: {
//             type: String,
//             enum: ["Open", "In Progress", "Resolved", "Closed"],
//             default: "Open"
//         },

//         createdBy: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true
//         },

//         assignedAgent: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             default: null
//         },

//         comments: [
//             {
//                 user: {
//                     type: mongoose.Schema.Types.ObjectId,
//                     ref: "User",
//                     required: true
//                 },

//                 message: {
//                     type: String,
//                     required: true,
//                     trim: true
//                 },

//                 createdAt: {
//                     type: Date,
//                     default: Date.now
//                 }
//             }
//         ],

//         activityHistory: [
//             {
//                 action: {
//                     type: String,
//                     required: true
//                 },

//                 performedBy: {
//                     type: mongoose.Schema.Types.ObjectId,
//                     ref: "User",
//                     required: true
//                 },

//                 details: {
//                     type: String
//                 },

//                 createdAt: {
//                     type: Date,
//                     default: Date.now
//                 }
//             }
//         ]
//     },
//     {
//         timestamps: true
//     }
// );

// const Ticket = mongoose.model("Ticket", ticketSchema);

// module.exports = Ticket;






const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            enum: ["Hardware", "Software", "Network", "Other"],
            required: true
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        status: {
            type: String,
            enum: ["Open", "Assigned", "In Progress", "Resolved", "Closed"],
            default: "Open"
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                message: {
                    type: String,
                    required: true,
                    trim: true
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        activityHistory: [
            {
                action: {
                    type: String,
                    required: true
                },
                performedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                details: {
                    type: String
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;

