"use strict";

const Schema = use("Schema");

class ImageSchema extends Schema {
  up() {
    this.create("images", table => {
      table.increments();
      table
        .integer("bicycle_station_id")
        .unsigned()
        .references("id")
        .inTable("bicycle_stations")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("path").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("images");
  }
}

module.exports = ImageSchema;
