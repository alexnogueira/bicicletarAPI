"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.post("/users", "UserController.create");
Route.post("/sessions", "SessionController.create");
Route.resource("bicycleStations", "BicycleStationController")
  .apiOnly()
  .middleware(
    new Map([
      [
        [
          "bicycleStations.store",
          "bicycleStations.update",
          "bicycleStations.delete"
        ],
        ["auth"]
      ]
    ])
  );
Route.post("bicycleStations/:id/images", "ImageController.store").middleware(
  "auth"
);
Route.get("images/:path", "ImageController.show");
