import User from "../db/models/user";
import { existsByQuery, insertOne } from "../utils/mongoose-utils";

const ADMIN_USER = {
  emailId: "admin@gmail.com",
  password: "samplePassword",
  role: "ADMIN",
  name: "Admin User",
  _id: "66b47ff577c995118548f41e",
  admin: true,
};

export const insertIfAdminNotAvailable = async () => {
  const userExists = await existsByQuery(User, { _id: ADMIN_USER._id });
  console.log("user exists =>", userExists);
  if (!userExists) {
    await insertOne(User, ADMIN_USER);
    console.log("Admin user created successfully");
  }
};
