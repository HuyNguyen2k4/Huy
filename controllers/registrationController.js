const Registration = require('../models/registrationModel');
const Event = require('../models/eventModel');

exports.getAvailableEvents = async (req, res) => {
    try {
        const events = await Event.find();
        const studentId = req.user.userId;

        // Get registration counts and student's registration status for each event
        const eventsWithStatus = await Promise.all(events.map(async (event) => {
            const registeredCount = await Registration.countDocuments({ eventId: event._id });
            const isRegistered = await Registration.findOne({
                studentId,
                eventId: event._id
            });

            return {
                ...event.toObject(),
                registeredCount,
                hasCapacity: registeredCount < event.capacity,
                isRegistered: !!isRegistered
            };
        }));

        res.render('registerEvent', { events: eventsWithStatus });
    } catch (error) {
        res.render('registerEvent', {
            events: [],
            error: 'Error loading events'
        });
    }
};

exports.unregisterEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const studentId = req.user.userId;

        // Find and check if registration exists for this student
        const registration = await Registration.findOne({
            eventId: id,
            studentId: studentId
        });

        if (!registration) {
            return res.render('registerEvent', {
                error: 'Registration not found',
                events: await getEventsWithCounts()
            });
        }

        // Delete the registration
        await Registration.findByIdAndDelete(registration._id);

        // Redirect back to list with success message
        res.redirect('/registration/list');

    } catch (error) {
        console.error('Unregister error:', error);
        res.render('registerEvent', {
            error: 'Error unregistering from event',
            events: await getEventsWithCounts()
        });
    }
};

async function getEventsWithCounts() {
    const events = await Event.find();
    return Promise.all(events.map(async (event) => {
        const registeredCount = await Registration.countDocuments({ eventId: event._id });
        return {
            ...event.toObject(),
            registeredCount,
            hasCapacity: registeredCount < event.capacity
        };
    }));
}

exports.registerEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const studentId = req.user.userId;

        // Check if student already registered for this event
        const existingRegistration = await Registration.findOne({
            studentId,
            eventId
        });

        if (existingRegistration) {
            return res.render('registerEvent', {
                error: 'You have already registered for this event',
                events: await getEventsWithCounts()
            });
        }

        // Check event capacity
        const event = await Event.findById(eventId);
        const registeredCount = await Registration.countDocuments({ eventId });

        if (registeredCount >= event.capacity) {
            return res.render('registerEvent', {
                error: 'Event has reached maximum capacity',
                events: await getEventsWithCounts()
            });
        }

        // Create new registration
        const registration = new Registration({
            studentId,
            eventId,
            registrationDate: new Date()
        });
        await registration.save();

        // Redirect back with success message
        res.redirect('/registration/list');

    } catch (error) {
        console.error('Registration error:', error);
        res.render('registerEvent', {
            error: 'Error registering for event',
            events: []
        });
    }
};

exports.getCancelPage = async (req, res) => {
    try {
        const { id } = req.params;
        const studentId = req.user.userId;

        // Find registration and populate event details
        const registration = await Registration.findOne({
            eventId: id,
            studentId
        }).populate('eventId');

        if (!registration) {
            return res.render('cancelRegistration', {
                event: null
            });
        }

        res.render('cancelRegistration', {
            event: registration.eventId
        });
    } catch (error) {
        console.error('Error loading cancel page:', error);
        res.render('cancelRegistration', {
            event: null
        });
    }
};