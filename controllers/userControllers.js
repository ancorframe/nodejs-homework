const {
  BadRequest,
  Conflict,
  Unauthorized,
  NotFound,
} = require("../helpers/errors");
const {
  registerUser,
  loginUser,
  logoutUser,
  updateSubscription,
  updateAvatar,
  verificationUser,
  verifyUser,
  forgotPasswordUser,
  restorePasswordUser,
} = require("../services/usersService");

const registerUserController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const register = await registerUser(email, password);
    res.status(201).json({ register });
  } catch (error) {
    throw new Conflict();
  }
};

const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  const login = await loginUser(email, password);
  if (!login) {
    throw new Unauthorized("Email or password is wrong");
  }
  res.json({ login });
};

const logoutUserController = async (req, res) => {
  const { _id } = req.user;
  await logoutUser(_id);
  res.status(204).json({});
};

const currentUserController = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updateSubscriptionController = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  if (!subscription) {
    throw new BadRequest("missing field subscription");
  }
  const update = await updateSubscription(_id, subscription);
  if (!update) {
    throw new BadRequest(
      "subscription can be only ['starter', 'pro', 'business']"
    );
  }
  res.json({ message: `subscription updated to: ${subscription}` });
};

const updateAvatarController = async (req, res) => {
  const filename = req.file.filename;
  const url = await updateAvatar(req, filename);
  res.json({ avatarURL: `${url}` });
};

const verificationUserController = async (req, res) => {
  const { verificationToken } = req.params;
  if (verificationToken) {
    throw new NotFound("Something wrong(. Try again");
  }
  const verify = await verificationUser(verificationToken);
  if (!verify) {
    throw new NotFound("User not found");
  }
  res.json({ message: "Verification successful" });
};

const verifyUserController = async (req, res) => {
  const { email } = req.body;
  const verify = await verifyUser(email);
  if (!verify) {
    throw new BadRequest("Verification has already been passed");
  }
  res.json({ message: "Verification email sent" });
};

const forgotPasswordUserController = async (req, res) => {
  const { email } = req.body;
  const forgotPassword = await forgotPasswordUser(email);
  if (!forgotPassword) {
    throw new BadRequest("Something wrong( Try again");
  }
  res.json({ message: "Restore email sent" });
};

const restorePasswordUserController = async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  const restorePassword = await restorePasswordUser(_id, password);
  if (!restorePassword) {
    throw new BadRequest("Something wrong( Try again");
  }
  res.json({ message: "Password was change" });
};

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  currentUserController,
  updateSubscriptionController,
  updateAvatarController,
  verificationUserController,
  verifyUserController,
  forgotPasswordUserController,
  restorePasswordUserController,
};
