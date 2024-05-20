import * as contactsService from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

export const getAllContacts = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const fields = "-createdAt -updatedAt";
  const skip = (page - 1) * limit;
  const settings = { skip, limit };
  const result = await contactsService.getContacts({ owner }, fields, settings);
  res.status(200).json(result);
});

export const getOneContact = ctrlWrapper(async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.getContactById({ _id, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(result);
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.removeContact({ _id, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(result);
});

export const createContact = ctrlWrapper(async (req, res) => {
  const { error } = createContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { _id: owner } = req.user;
  const result = await contactsService.addContact({ ...req.body, owner });

  res.status(201).json(result);
});

export const updateStatusContact = ctrlWrapper(async (req, res, next) => {
  const { error } = updateStatusContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.updateStatusContact(
    { _id, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result).status(200);
});

export const updateContact = ctrlWrapper(async (req, res) => {
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.updateContact({ _id, owner }, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result).status(200);
});
