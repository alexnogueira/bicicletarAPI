"use strict";

class SessionController {
  async create({ request, auth }) {
    const { email, password } = request.all();

    password = await Hash.make(password);
    const token = await auth.attempt(email, password);

    return token;
  }
}

module.exports = SessionController;
