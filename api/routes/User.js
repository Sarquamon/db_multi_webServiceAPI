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

router.post("/login", (req, res, next) => {
  const { userEmail } = req.body;

  User.find({ userEmail: userEmail })
    .exec()
    .then(result => {
      if (result.length >= 1) {
        console.log(`Success! \nUser: ${userEmail}.\nAuth Successful`);

        return res.status(200).json({
          message: "Autorizado!",
          userEmail: result[0].userEmail,
          userName: result[0].userName
        });
      } else {
        console.log("User does not exist");
        return res.status(404).json({
          message: "Usuario no existe"
        });
      }
    })
    .catch(err => {
      console.log(`Error! \n${err}`);
      res.status(500).json({
        message: "Error!",
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

router.put("/:userEmail", (req, res, next) => {
  const { userEmail } = req.params;

  const { userName } = req.body;

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

module.exports = router;
