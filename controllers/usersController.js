const db = require("../services/db");
const { v4: uuidv4 } = require("uuid");

const getAllUsers = async (req, res) => {
  try {
    const users = await db("users").select("*");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db("users").where("user_id", id).first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      user_id: uuidv4(),
      username,
      email,
      password,
      full_name,
      phone,
      profile_picture,
      total_score: 0,
      total_xp: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await db("users").insert(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updated_at = new Date();

    const updatedUser = await db("users")
      .where("user_id", id)
      .update(updates)
      .returning("*");

    if (!updatedUser.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db("users").where("user_id", id).del().returning("*");

    if (!deleted.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
