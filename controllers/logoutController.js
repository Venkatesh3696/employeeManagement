const User = require("../model/User");

const handleLogout = async (req, res) => {
  // On client also delete the accesstoken

  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); // no content
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  // Delete refresh token in db
  foundUser.refreshToken = "";
  const result = await foundUser.save();

  console.log(result);

  res.clearCookie("jwt", { httpOnly: true }); // add secure : true in production for https
};

module.exports = { handleLogout };
