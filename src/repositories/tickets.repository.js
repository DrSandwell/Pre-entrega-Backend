const { ticketDAO } = require('../daos/mongo');

class TicketRepository {
    async createTicket(ticket) {
        return await ticketDAO.createTicket(ticket);
    }
}

module.exports = new TicketRepository();
