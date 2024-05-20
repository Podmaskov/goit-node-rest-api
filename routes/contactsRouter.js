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
import authenticate from "../middlewares/authenticate.js";
import validateBody from "../decorators/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isVAlidId, getOneContact);

contactsRouter.delete("/:id", isVAlidId, deleteContact);

contactsRouter.post(
  "/",
  isEmptyBody,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.patch(
  "/:id/favorite",
  isVAlidId,
  isEmptyBody,
  validateBody(updateStatusContactSchema),
  updateStatusContact
);

contactsRouter.put(
  "/:id",
  isVAlidId,
  isEmptyBody,
  validateBody(updateContactSchema),
  updateContact
);

export default contactsRouter;
