const TicketModel = require('../../models/ticket.model.js');

class TicketDAO {
    async createTicket(ticket) {
        return await TicketModel.create(ticket);
    }
}

module.exports = new TicketDAO();
