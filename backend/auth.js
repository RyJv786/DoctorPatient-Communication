const express = require("express");
const Sequelize = require("sequelize");
const router = express.Router();
const { User } = require("./Tables/index");

// Signup Route
router.post("/Signup", async (req, res) => {
  try {
    console.log(req.body);
    const { firstname, lastname, gender, usertype, email, password } = req.body;
    const user = await User.create({
      firstname,
      lastname,
      gender,
      usertype,
      email,
      password,
    });
    res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    res.json("Error")
  }
});

// Emails Route
router.post("/Emails", async (req, res) => {
  try {
    const { search } = req.body;
    const patients = await User.findAll({
      attributes: ["email", "block"],
      where: {
        usertype: "patient",
        email: {
          [Sequelize.Op.like]: `%${search}%`,
        },
      },
    });

    const studentEmails = patients.map((patient) => ({
      email: patient.email,
      block: patient.block,
    }));

    return res.status(200).json(studentEmails);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

// Login Route
router.post("/Login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, password } });

    if (user) {
      res.status(200).json({ user });
      console.log(user.dataValues.usertype)
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
