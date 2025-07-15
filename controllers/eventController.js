const Event = require('../models/eventModel');
const Registration = require('../models/registrationModel');
const User = require('../models/userModel');

exports.listEvents = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const total = await Registration.countDocuments();

        const registrations = await Registration.find()
            .populate({
                path: 'studentId',
                select: 'username _id',
                model: User
            })
            .populate({
                path: 'eventId',
                select: 'name description', 
                model: Event
            })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ registrationDate: -1 });

        if (registrations.length === 0) {
            return res.render('listRegistrations', {
                message: 'No students have registered yet',
                registrations: [],
                pagination: { page, limit, total }
            });
        }

        console.log('Registrations:', JSON.stringify(registrations, null, 2));

        res.render('listRegistrations', {
            registrations,
            pagination: { page, limit, total }
        });

    } catch (error) {
        console.error('Error:', error);
        res.render('listRegistrations', {
            error: 'Error loading registrations',
            registrations: []
        });
    }
};

exports.getEventsPage = async (req, res) => {
    try {
        const events = await Event.find();

        const eventsWithCounts = await Promise.all(events.map(async (event) => {
            const registeredCount = await Registration.countDocuments({ eventId: event._id });
            return {
                ...event.toObject(),
                registeredCount
            };
        }));

        res.render('registerEvent', { events: eventsWithCounts });
    } catch (error) {
        console.error('Error:', error);
        res.render('registerEvent', {
            events: [],
            error: 'Error loading events'
        });
    }
};