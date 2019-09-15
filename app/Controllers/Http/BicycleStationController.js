"use strict";

const BicycleStation = use("App/Models/BicycleStation");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with bicyclestations
 */
class BicycleStationController {
  /**
   * Show a list of all bicyclestations.
   * GET bicyclestations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const bicyclestations = BicycleStation.query()
      .with("images")
      .fetch();
    return bicyclestations;
  }

  async near({ request }) {
    const { latitude, longitude } = request.all();

    const bicyclestations = BicycleStation.query()
      .nearBy(latitude, longitude, 10)
      .fetch();

    return bicyclestations;
  }

  /**
   * Create/save a new bicyclestation.
   * POST bicyclestations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ auth, request, response }) {
    const { id } = auth.user;
    const data = request.only(["title", "address", "latitude", "longitude"]);

    const bicyclestation = await BicycleStation.create({
      ...data,
      user_id: id
    });

    return bicyclestation;
  }

  /**
   * Display a single bicyclestation.
   * GET bicyclestations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params }) {
    const bicyclestation = await BicycleStation.findOrFail(params.id);

    await bicyclestation.load("images");

    return bicyclestation;
  }

  /**
   * Update bicyclestation details.
   * PUT or PATCH bicyclestations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const bicyclestation = await Bicyclestation.findOrFail(params.id);

    const data = request.only(["title", "address", "latitude", "longitude"]);

    bicyclestation.merge(data);

    await bicyclestation.save();

    return bicyclestation;
  }

  /**
   * Delete a bicyclestation with id.
   * DELETE bicyclestations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const bicyclestation = await BicycleStation.findOrFail(params.id);

    if (bicyclestation.user_id !== auth.user.id) {
      return response.status(401).send({ error: "Not authorized" });
    }

    await bicyclestation.delete();
  }
}

module.exports = BicycleStationController;
