const Ticket = require("../models/ticket.model");

class TicketRepository {
    async getTicketById(id) {
        try {
            const ticket = await Ticket.findById(id);
            if (!ticket) {
                winston.warning("ticket no encontrado");
            }
            return ticket;
        } catch (error) {
            throw new Error("El ticket no existe");
        }
    }
}

module.exports = TicketRepository;