module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,},
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,},
    gender: {
      type: DataTypes.STRING,
      allowNull: false,},
    usertype: {
      type: DataTypes.STRING,
      allowNull: false,},
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,},
    password: {
      type: DataTypes.STRING,
      allowNull: false,},
    block: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, },
  });
  return User;
};
