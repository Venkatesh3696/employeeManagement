const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    // console.log(data);
    this.users = data;
  },
};

const bcrypt = require("bcrypt");
const fsPromises = require("fs").promises;
const path = require("path");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: "username and passwords are required! " });
  }

  const duplicate = usersDB.users.find((person) => person.username === user);

  if (duplicate) return res.sendStatus(409);

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = {
      username: user,
      roles: { User: 2001 },
      password: hashedPwd,
    };
    usersDB.setUsers([...usersDB.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    // console.log(usersDB.users);
    res.status(201).json({ success: `New user ${user} created!` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
