import { Router } from "express";
import { forgotPassword, resetPassword } from "../controllers/PasswordResetController.js";
import { forgotValidator, resetValidator } from "../validators/passwordResetValidators.js";
import { handleValidation } from "../middlewares/handleValidation.js";

const router = Router();

router.post("/forgot-password", forgotValidator, handleValidation, forgotPassword);
router.post("/reset-password",  resetValidator,  handleValidation, resetPassword);

export default router;