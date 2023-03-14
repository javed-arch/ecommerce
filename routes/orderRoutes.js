import express from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import {
  brainTreePaymentController,
  braintreeTokenController,
} from "../controllers/orderController.js";

//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", verifyUser, brainTreePaymentController);

export default router;
