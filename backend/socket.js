const { Message, User } = require("./Tables");
const { Op } = require("sequelize");
const fs = require("fs");

module.exports = (io) => {
  const userSockets = new Map();
  const selectedEmails = {};

  io.on("connection", (socket) => {
    socket.on("fileUpload", async ({ fileInfo, email, sender }) => {
      console.log(email);
      if (email) {
        const { filename, data } = fileInfo;
        const filePath = `Images/${filename}`;
        fs.writeFile(filePath, data, "binary", (err) => {
          if (err) {
            console.error("Error uploading file:", err);
            return;
          }
          console.log("File uploaded successfully:", filename);
        });
        const messageSaved = await Message.create({
          text: filePath,
          sender: sender,
          receiver: email,
          isFile: true,
        });
        io.to(userSockets.get(email)).emit("messageRecieved", messageSaved);
      } else {
        socket.emit("error", "email not found");
      }
    });
    socket.on("joinUser", async (email) => {
      userSockets.set(email, socket.id);
      const receiverSocketId = userSockets.get(email);
      const allMessages = await Message.findAll({
        attributes: ["id", "sender", "text", "receiver", "isFile"], // Select the sender's name and message
        where: {
          [Op.or]: [
            { receiver: email }, // Messages sent to the receiver
            { sender: email }, // Messages sent by the receiver
          ],
        },
      });
      try {

        io.to(receiverSocketId).emit("allMessagesRecieved", allMessages);
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("loadUserChat", async (email) => {
      const allMessages = await Message.findAll({
        attributes: ["id", "sender", "text", "receiver", "isFile"], // Select the sender's name and message 
        where: {
          [Op.or]: [
            { receiver: email }, // Messages sent to the receiver
            { sender: email }, // Messages sent by the receiver
          ],
        },
      });
      socket.emit("allMessagesRecieved", allMessages);
    });
    socket.on("selectEmail", (email) => {
      selectedEmails[email] = socket.id;
      socket.emit("emailSelected", email);
    });
    socket.on("BlockUser", async (email) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        // Handle case where user is not found
        console.log("User not found");
        return;
      }

      // Update the user's profile with block set to true
      await user.update({ block: true });

      // Emit a success message or updated user profile back to the client
      socket.emit("profileUpdated", user);
      io.to(userSockets.get(email)).emit("userProfileUpdated", user);
    });
    socket.on("unBlockUser", async (email) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        // Handle case where user is not found
        console.log("User not found");
        return;
      }

      // Update the user's profile with block set to true
      await user.update({ block: false });

      // Emit a success message or updated user profile back to the client
      socket.emit("profileUpdated", user);
      io.to(userSockets.get(email)).emit("userProfileUpdated", user);
    });
    socket.on("sendMessage", async ({ email, message, sender }) => {
      console.log(email, message, sender);
      const messageSaved = await Message.create({
        text: message,
        sender: sender,
        receiver: email,
      });
      io.to(userSockets.get(email)).emit("messageRecieved", messageSaved);
    });

    socket.on("disconnect", () => {
      // Remove the email from the selected emails when a user disconnects
      const selectedEmail = Object.keys(selectedEmails).find(
        (email) => selectedEmails[email] === socket.id
      );
      if (selectedEmail) {
        delete selectedEmails[selectedEmail];
      }
      userSockets.forEach((value, key) => {
        if (value === socket.id) {
          userSockets.delete(key);
        }
      });
    });


  });
};
