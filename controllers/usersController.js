const { turso } = require("../configs/tursoDatabase");
const { v4: uuidv4 } = require("uuid");

const getAllUsers = async (req, res) => {
  try {
    const users = await turso.execute("SELECT * FROM users");
    res.status(200).json(users.rows);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await turso.execute("SELECT * FROM users WHERE user_id = ?", [
      id,
    ]);

    if (!user.rows.length) {
      return res.status(404).json({
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    res.status(200).json(user.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      uid,
      username,
      email,
      password,
      full_name,
      phone,
      profile_picture,
    } = req.body;
    const newUser = {
      user_id: uid || uuidv4(),
      username,
      email,
      password,
      full_name,
      phone,
      profile_picture,
      total_score: 0,
      total_xp: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await turso.execute(
      "INSERT INTO users (user_id, username, email, password, full_name, phone, profile_picture, total_score, total_xp, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        newUser.user_id,
        newUser.username,
        newUser.email,
        newUser.password,
        newUser.full_name,
        newUser.phone,
        newUser.profile_picture,
        newUser.total_score,
        newUser.total_xp,
        newUser.created_at,
        newUser.updated_at,
      ]
    );
    res.status(201).json({
      message: "User created successfully",
      code: "USER_CREATED",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updated_at = new Date().toISOString();

    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updates), id];

    const result = await turso.execute(
      `UPDATE users SET ${setClause} WHERE user_id = ? RETURNING *`,
      values
    );

    if (!result.rows.length) {
      return res.status(404).json({
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      code: "USER_UPDATED",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await turso.execute(
      "DELETE FROM users WHERE user_id = ? RETURNING *",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      code: "USER_DELETED",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
