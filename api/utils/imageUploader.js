const cloudinary = require("cloudinary");
const { fill } = require("lodash");

const uploadImage = async (file) => {
  var data;
  await cloudinary.v2.uploader.upload(
    file.path,
    {
      eager: [
        {
          width: 250,
          height: 150,
          crop: "fill",
        },
      ],
    },
    (err, result) => {
      if (err) {
        console.log("cloudinary err: " + err);
        data = err;
      } else {
        var test = JSON.stringify(result);
        console.log("cloudinary res: " + test);
        data = {
          public_id: result.public_id,
          secure_url: result.secure_url,
          thumbnail: result.eager[0].secure_url,
        };
      }
    }
  );

  console.log(data);

  return data;
};

module.exports = uploadImage;
