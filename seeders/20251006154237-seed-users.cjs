// src/database/seeders/20251006154237-seed-users.js

"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;
    const now = new Date();

    // Hasheamos las contraseñas
    const adminPassword = await bcrypt.hash("admin123", saltRounds);
    const userPassword = await bcrypt.hash("user123", saltRounds);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          username: "AdminUser",
          email: "admin@abisal.com",
          password: adminPassword,
          name: "Admin",
          last_name: "Abisal",
          role: "admin",
          created_at: now,
          updated_at: now,
        },
        {
          username: "RegularUser",
          email: "user@abisal.com",
          password: userPassword,
          name: "User",
          last_name: "Corriente",
          role: "user",
          created_at: now,
          updated_at: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};