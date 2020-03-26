const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const User = require("../../models/userModel");

router.post("/signup", (req, res, next) => {
  const { userEmail, userName } = req.body;

  User.find({ userEmail: userEmail })
    .exec()
    .then(user => {
      if (user.length <= 0) {
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          userEmail: userEmail,
          userName: userName
        });

        newUser
          .save()
          .then(result => {
            console.log(`Success! ${result}`);
            res.status(201).json({
              message: `Exito! \nUsuario creado`,
              res: result
            });
          })
          .catch(err => {
            console.log(`Error! \n${err}`);
            res.status(500).json({
              message: "Error!",
              error: err
            });
          });
      } else {
        console.log(`Email already taken!`);
        res.status(409).json({
          message: `Email ya tomado!`
        });
      }
    })
    .catch(err => {
      console.log(`Error! ${err}`);
      res.status(500).json({
        message: `Error`,
        error: err
      });
    });
});

router.delete("/:userEmail", (req, res, next) => {
  const { userEmail } = req.params;

  if (userEmail) {
    User.findOneAndRemove({ userEmail: userEmail })
      .exec()
      .then(result => {
        if (result) {
          console.log(`Success! User: ${userEmail} has been deleted`);
          return res.status(200).json({
            message: `El usuario ${userEmail} ha sido eliminado`
          });
        } else {
          console.log(`The user! ${userEmail} does not exists`);
          return res.status(404).json({
            message: `El usuario ${userEmail} no existe!`
          });
        }
      })
      .catch(err => {
        console.log(`Error 2! \n${err}`);
        res.status(500).json({
          message: `Error 2!`,
          error: err
        });
      });
  } else {
    console.log(`Error 1! Empty userEmail: "${userEmail}" param.`);

    return res.status(500).json({
      message: "Error 1!",
      err: `Parametro userEmail vacio.`
    });
  }
});

router.put("/:userEmail/:userName", (req, res, next) => {
  const { userEmail, userName } = req.params;

  console.log(userEmail, userName);

  User.findOneAndUpdate({ userEmail: userEmail }, { userName }, { new: true })
    .exec()
    .then(result => {
      console.log(result);
      return res.status(200).json({
        message: "Exito!",
        description: `Se actualizo el nombre a ${userName}`
      });
    })
    .catch(err => {
      console.log(`Error! ${err}`);
      return res.status(500).json({
        message: "Error!",
        error: err
      });
    });
});

router.get("/all", (req, res, next) => {
  User.find()
    .exec()
    .then(result => {
      if (result) {
        if (result.length >= 1) {
          console.log(`Exito! \n${result}`);

          const users = [];

          result.forEach(user => {
            users.push({
              Name: user.userName,
              Email: user.userEmail
            });
          });

          return res.status(200).json({
            message: "Success!",
            content: users
          });
        } else {
          return res.status(404).json({
            message: "Error 3!",
            error: "Usuarios nulos"
          });
        }
      } else {
        return res.status(404).json({
          message: "Error 2!",
          error: "Usuarios nulos"
        });
      }
    })
    .catch(err => {
      console.log(`Error! ${err}`);
      return res.status(500).json({
        message: "Error 1!",
        error: err
      });
    });
});

module.exports = router;
