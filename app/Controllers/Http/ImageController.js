"use strict";

const Helpers = use("Helpers");
const Image = use("App/Models/Image");
const BicycleStation = use("App/Models/BicycleStation");
const aws = use("aws-sdk");
const Env = use("Env");
const fs = use("fs");
const path = use("path");

aws.config.update({
  secretAccessKey: Env.get("S3_SECRET_ACCESS_KEY"),
  accessKeyId: Env.get("S3_ACCESS_KEY_ID"),
  region: Env.get("S3_REGION"),
  apiVersion: "2006-03-01"
});

const s3 = new aws.S3();
/**
 * Resourceful controller for interacting with images
 */
class ImageController {
  async show({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/${params.path}`));
  }

  /**
   * Create/save a new image.
   * POST images
   */
  async store({ params, request }) {
    const bicycleStation = await BicycleStation.findOrFail(params.id);

    const images = request.file("image", {
      types: ["image"],
      size: "2mb"
    });

    await images.moveAll(Helpers.tmpPath("uploads"), file => ({
      name: `${Date.now()}-${file.clientName}`
    }));

    if (!images.movedAll()) {
      return images.errors();
    }

    await Promise.all(
      images.movedList().map(image => {
        var uploadParams = { Bucket: Env.get("S3_BUCKET"), ACL: "public-read" };
        var fileStream = fs.createReadStream(
          `${Helpers.tmpPath("uploads")}${path.sep}${image.fileName}`
        );
        uploadParams.Body = fileStream;
        uploadParams.Key = image.fileName;
        s3.upload(uploadParams, function(err, data) {
          if (err) {
            console.log("Error", err);
          }
          if (data) {
            bicycleStation.images().create({ path: data.Location });
          }
        });
      })
    );
  }
}

module.exports = ImageController;
