const mongoose = require("mongoose");
const cities = require("./cities.js");
const { places, descriptors } = require("./seedHelper.js");
const Campground = require("../models/campground");

mongoose
  .connect("mongodb://localhost:27017/campster", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected"))
  .catch((e) => console.log(e));

const titleCreate = (array) => array[Math.floor(Math.random() * array.length)];

// const seedDB = async () => {
//   await Campground.deleteMany({});
//   for (let i = 0; i < 50; i++) {
//       const random1000 = Math.floor(Math.random() * 1000);
//       const price = Math.floor(Math.random() * 20) + 10;
//       const camp = new Campground({
//           location: `${cities[random1000].city}, ${cities[random1000].state}`,
//           title: `${sample(descriptors)} ${sample(places)}`,
//           image: 'https://source.unsplash.com/collection/483251',
//           description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
//           price
//       })
//       await camp.save();
//   }
// }

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randomNum = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 1299);
    const camp = new Campground({
      location: `${cities[randomNum].city} , ${cities[randomNum].state}`,
      title: `${titleCreate(places)} ${titleCreate(descriptors)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
