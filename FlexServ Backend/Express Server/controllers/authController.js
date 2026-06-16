const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register function
const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role_id,
    } = req.body;

    // Validate fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    

    // Check existing user
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `
  INSERT INTO users
  (
    first_name,
    last_name,
    email,
    phone,
    password,
    role_id
  )
  VALUES (?, ?, ?, ?, ?, ?)
  `,
      [firstName, lastName, email, phone, hashedPassword, role_id],
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// login function

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      `
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          u.password,
          r.role_name
        FROM users u
        INNER JOIN roles r
        ON u.role_id = r.id
        WHERE u.email = ?
        `,
      [email],
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role_name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role_name,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// info of current user
const getCurrentUser = async (req, res) => {
  try {
    const [users] = await db.query(
      `
            SELECT
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                r.role_name
            FROM users u
            JOIN roles r
                ON u.role_id = r.id
            WHERE u.id = ?
            `,
      [req.user.id],
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Export

module.exports = {
  register,
  login,
  getCurrentUser,
};
