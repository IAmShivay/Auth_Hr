import { Router } from "express";
import {
  addUser,
  AuthController,
  getUsersByCompanyId,
  updateUserDetails,
} from "../controllers/auth.controller";
import { auth, userVerify } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import {
  signupSchema,
  loginSchema,
  updateUserSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth.validator";

const router = Router();

router.post("/signup", validateRequest(signupSchema), AuthController.signup);
router.post("/login", validateRequest(loginSchema), AuthController.login);
router.get("/verify", userVerify);
router.get("/getuser/:id", getUsersByCompanyId);
router.put(
  "/profile",
  auth,
  validateRequest(updateUserSchema),
  AuthController.updateProfile
);
router.post(
  "/change-password",
  auth,
  validateRequest(changePasswordSchema),
  AuthController.changePassword
);
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  AuthController.forgotPassword
);
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  AuthController.resetPassword
);
router.post("/add-user", auth, addUser);
router.put("/update-user/:id", auth, updateUserDetails);

export default router;
