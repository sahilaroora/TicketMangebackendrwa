

// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const User = require("../Model/userSchema");
// const Ticket = require("../Model/ticktSchema");

// // ==========================================
// // 1. USER REGISTRATION
// // POST /api/users/register
// // ==========================================

// router.post("/register", async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         if (!name || !email || !password) {
//             return res.status(400).json({
//                 message: "All fields are required"
//             });
//         }

//         const normalizedEmail = email.trim().toLowerCase();
//         const userRole = role ? role.toUpperCase() : "USER";

//         if (!["USER", "AGENT"].includes(userRole)) {
//             return res.status(400).json({
//                 message: "Invalid role"
//             });
//         }

//         const existingUser = await User.findOne({
//             email: normalizedEmail
//         });

//         if (existingUser) {
//             return res.status(409).json({
//                 message: "User already exists"
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = await User.create({
//             name: name.trim(),
//             email: normalizedEmail,
//             password: hashedPassword,
//             role: userRole
//         });

//         return res.status(201).json({
//             message: "User registered successfully",
//             user: {
//                 id: newUser._id,
//                 name: newUser.name,
//                 email: newUser.email,
//                 role: newUser.role
//             }
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         });
//     }
// });


// // ==========================================
// // 2. USER LOGIN
// // POST /api/users/login
// // ==========================================

// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({
//                 message: "Email and password are required"
//             });
//         }

//         const normalizedEmail = email.trim().toLowerCase();

//         const user = await User.findOne({
//             email: normalizedEmail
//         });

//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found. Please register first."
//             });
//         }

//         const isMatch = await bcrypt.compare(
//             password,
//             user.password
//         );

//         if (!isMatch) {
//             return res.status(401).json({
//                 message: "Invalid password"
//             });
//         }

//         return res.status(200).json({
//             message: "Login successful",
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             }
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         });
//     }
// });


// // ==========================================
// // 3. CREATE TICKET
// // POST /api/users/create
// // ==========================================

// router.post("/create", async (req, res) => {
//     try {
//         const {
//             title,
//             description,
//             category,
//             priority,
//             createdBy
//         } = req.body;

//         if (
//             !title ||
//             !description ||
//             !category ||
//             !createdBy
//         ) {
//             return res.status(400).json({
//                 message: "All required fields are mandatory"
//             });
//         }

//         if (!mongoose.Types.ObjectId.isValid(createdBy)) {
//             return res.status(400).json({
//                 message: "Invalid user ID"
//             });
//         }

//         const user = await User.findById(createdBy);

//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found"
//             });
//         }

//         const ticket = await Ticket.create({
//             title,
//             description,
//             category,
//             priority: priority || "Medium",
//             createdBy
//         });

//         return res.status(201).json({
//             message: "Ticket created successfully",
//             ticket
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         });
//     }
// });


// // ==========================================
// // 4. GET MY TICKETS
// // GET /api/users/my-tickets/:userId
// // ==========================================

// router.get("/my-tickets/:userId", async (req, res) => {
//     try {
//         const { userId } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).json({
//                 message: "Invalid user ID"
//             });
//         }

//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found"
//             });
//         }

//         const tickets = await Ticket.find({
//             createdBy: userId
//         })
//             .populate("assignedTo", "name email")
//             .sort({ createdAt: -1 });

//         return res.status(200).json({
//             message: "My tickets fetched successfully",
//             totalTickets: tickets.length,
//             tickets
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         });
//     }
// });


// // ==========================================
// // 5. GET ALL TICKETS
// // GET /api/users/all
// // ==========================================

// router.get("/all", async (req, res) => {
//     try {
//         const tickets = await Ticket.find()
//             .populate("createdBy", "name email")
//             .populate("assignedTo", "name email")
//             .sort({ createdAt: -1 });

//         return res.status(200).json({
//             message: "All tickets fetched successfully",
//             totalTickets: tickets.length,
//             tickets
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         });
//     }
// });


// // ==========================================
// // 6. GET ALL AGENTS
// // GET /api/users/agents
// // ==========================================

// router.get("/agents", async (req, res) => {
//     try {
//         const agents = await User.find({
//             role: "AGENT"
//         }).select("name email");

//         return res.status(200).json({
//             message: "Agents fetched successfully",
//             totalAgents: agents.length,
//             agents
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         });
//     }
// });


// // ==========================================
// // 7. ASSIGN / REASSIGN TICKET
// // PUT /api/users/assign/:ticketId
// // ==========================================

// router.put("/assign/:ticketId", async (req, res) => {
//     try {
//         const { ticketId } = req.params;
//         const { assignedTo } = req.body;

//         // Validate ticket ID
//         if (!mongoose.Types.ObjectId.isValid(ticketId)) {
//             return res.status(400).json({
//                 message: "Invalid ticket ID"
//             });
//         }

//         // Validate agent ID
//         if (!assignedTo) {
//             return res.status(400).json({
//                 message: "Agent ID is required"
//             });
//         }

//         if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
//             return res.status(400).json({
//                 message: "Invalid agent ID"
//             });
//         }

//         // Check whether agent exists
//         const agent = await User.findOne({
//             _id: assignedTo,
//             role: "AGENT"
//         });

//         if (!agent) {
//             return res.status(404).json({
//                 message: "Agent not found"
//             });
//         }

//         // Find ticket and update assigned agent.
//         // This also allows reassignment to another agent.
//         const ticket = await Ticket.findByIdAndUpdate(
//             ticketId,
//             {
//                 $set: {
//                     assignedTo: agent._id,
//                     status: "Assigned"
//                 }
//             },
//             {
//                 new: true,
//                 runValidators: true
//             }
//         )
//             .populate("assignedTo", "name email")
//             .populate("createdBy", "name email");

//         if (!ticket) {
//             return res.status(404).json({
//                 message: "Ticket not found"
//             });
//         }

//         return res.status(200).json({
//             message: "Ticket assigned/reassigned successfully",
//             ticket
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         });
//     }
// });


// // ==========================================
// // 8. UPDATE TICKET
// // PUT /api/users/update/:id
// // ==========================================

// router.put("/update/:id", async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({
//                 message: "Invalid ticket ID"
//             });
//         }

//         const {
//             title,
//             description,
//             category,
//             priority,
//             status
//         } = req.body;

//         const updateData = {};

//         if (title !== undefined) updateData.title = title;
//         if (description !== undefined) updateData.description = description;
//         if (category !== undefined) updateData.category = category;
//         if (priority !== undefined) updateData.priority = priority;
//         if (status !== undefined) updateData.status = status;

//         const updatedTicket = await Ticket.findByIdAndUpdate(
//             id,
//             {
//                 $set: updateData
//             },
//             {
//                 new: true,
//                 runValidators: true
//             }
//         )
//             .populate("createdBy", "name email")
//             .populate("assignedTo", "name email");

//         if (!updatedTicket) {
//             return res.status(404).json({
//                 message: "Ticket not found"
//             });
//         }

//         return res.status(200).json({
//             message: "Ticket updated successfully",
//             ticket: updatedTicket
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         });
//     }
// });


// // ==========================================
// // 9. DELETE TICKET
// // DELETE /api/users/delete/:id
// // ==========================================

// router.delete("/delete/:id", async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({
//                 message: "Invalid ticket ID"
//             });
//         }

//         const deletedTicket = await Ticket.findByIdAndDelete(id);

//         if (!deletedTicket) {
//             return res.status(404).json({
//                 message: "Ticket not found"
//             });
//         }

//         return res.status(200).json({
//             message: "Ticket deleted successfully",
//             ticket: deletedTicket
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         });
//     }
// });


// // ==========================================
// // 10. GET SINGLE TICKET
// // GET /api/users/:id
// // Keep this route at the bottom
// // ==========================================

// router.get("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({
//                 message: "Invalid ticket ID"
//             });
//         }

//         const ticket = await Ticket.findById(id)
//             .populate("createdBy", "name email")
//             .populate("assignedTo", "name email");

//         if (!ticket) {
//             return res.status(404).json({
//                 message: "Ticket not found"
//             });
//         }

//         return res.status(200).json({
//             message: "Ticket fetched successfully",
//             ticket
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         });
//     }
// });


// // ==========================================
// // EXPORT ROUTER
// // ==========================================

// module.exports = router;








const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../Model/userSchema");
const Ticket = require("../Model/ticktSchema");

// ==========================================
// 1. USER REGISTRATION
// POST /api/users/register
// ==========================================

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const userRole = role ? role.toUpperCase() : "USER";

        if (!["USER", "AGENT"].includes(userRole)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

        const hashedPassword = await bcrypt.hash(
            password,
            saltRounds
        );

        const newUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: userRole
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});


// ==========================================
// 2. USER LOGIN
// POST /api/users/login
// ==========================================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found. Please register first."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});


// ==========================================
// 3. CREATE TICKET
// POST /api/users/create
// ==========================================

router.post("/create", async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            priority,
            createdBy
        } = req.body;

        if (
            !title ||
            !description ||
            !category ||
            !createdBy
        ) {
            return res.status(400).json({
                message: "All required fields are mandatory"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(createdBy)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const user = await User.findById(createdBy);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const ticket = await Ticket.create({
            title,
            description,
            category,
            priority: priority || "Medium",
            createdBy
        });

        return res.status(201).json({
            message: "Ticket created successfully",
            ticket
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});


// ==========================================
// 4. GET MY TICKETS
// GET /api/users/my-tickets/:userId
// ==========================================

router.get("/my-tickets/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const tickets = await Ticket.find({
            createdBy: userId
        })
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "My tickets fetched successfully",
            totalTickets: tickets.length,
            tickets
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});


// ==========================================
// 5. GET ALL TICKETS
// GET /api/users/all
// ==========================================

router.get("/all", async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate("createdBy", "name email")
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All tickets fetched successfully",
            totalTickets: tickets.length,
            tickets
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});


// ==========================================
// 6. GET ALL AGENTS
// GET /api/users/agents
// ==========================================

router.get("/agents", async (req, res) => {
    try {
        const agents = await User.find({
            role: "AGENT"
        }).select("name email");

        return res.status(200).json({
            message: "Agents fetched successfully",
            totalAgents: agents.length,
            agents
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});


// ==========================================
// 7. ASSIGN / REASSIGN TICKET
// PUT /api/users/assign/:ticketId
// ==========================================

router.put("/assign/:ticketId", async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { assignedTo } = req.body;

        if (!mongoose.Types.ObjectId.isValid(ticketId)) {
            return res.status(400).json({
                message: "Invalid ticket ID"
            });
        }

        if (!assignedTo) {
            return res.status(400).json({
                message: "Agent ID is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
            return res.status(400).json({
                message: "Invalid agent ID"
            });
        }

        const agent = await User.findOne({
            _id: assignedTo,
            role: "AGENT"
        });

        if (!agent) {
            return res.status(404).json({
                message: "Agent not found"
            });
        }

        const ticket = await Ticket.findByIdAndUpdate(
            ticketId,
            {
                $set: {
                    assignedTo: agent._id,
                    status: "Assigned"
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        return res.status(200).json({
            message: "Ticket assigned/reassigned successfully",
            ticket
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});


// ==========================================
// 8. UPDATE TICKET
// PUT /api/users/update/:id
// ==========================================

router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid ticket ID"
            });
        }

        const {
            title,
            description,
            category,
            priority,
            status
        } = req.body;

        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (priority !== undefined) updateData.priority = priority;
        if (status !== undefined) updateData.status = status;

        const updatedTicket = await Ticket.findByIdAndUpdate(
            id,
            {
                $set: updateData
            },
            {
                new: true,
                runValidators: true
            }
        )
            .populate("createdBy", "name email")
            .populate("assignedTo", "name email");

        if (!updatedTicket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        return res.status(200).json({
            message: "Ticket updated successfully",
            ticket: updatedTicket
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});


// ==========================================
// 9. DELETE TICKET
// DELETE /api/users/delete/:id
// ==========================================

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid ticket ID"
            });
        }

        const deletedTicket = await Ticket.findByIdAndDelete(id);

        if (!deletedTicket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        return res.status(200).json({
            message: "Ticket deleted successfully",
            ticket: deletedTicket
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});


// ==========================================
// 10. GET SINGLE TICKET
// GET /api/users/:id
// ==========================================

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid ticket ID"
            });
        }

        const ticket = await Ticket.findById(id)
            .populate("createdBy", "name email")
            .populate("assignedTo", "name email");

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        return res.status(200).json({
            message: "Ticket fetched successfully",
            ticket
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
