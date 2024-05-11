import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import isVAlidId from "../middlewares/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isVAlidId, getOneContact);

contactsRouter.delete("/:id", isVAlidId, deleteContact);

contactsRouter.post("/", isEmptyBody, createContact);

contactsRouter.patch(
  "/:id/favorite",
  isVAlidId,
  isEmptyBody,
  updateStatusContact
);

contactsRouter.put("/:id", isVAlidId, isEmptyBody, updateContact);

export default contactsRouter;
