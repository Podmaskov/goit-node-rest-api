import Contact from "../models/contact.js";

export const getContacts = (
  filter = {},
  field = "",
  settings = { skip: 0, limit: 20 }
) =>
  Contact.find(filter, field, settings).populate("owner", "email subscription");

export const getContactById = (filter) => Contact.findOne(filter);

export const addContact = (data) => Contact.create(data);

export const updateContact = (filter, data) =>
  Contact.findOneAndUpdate(filter, data);

export const updateStatusContact = (filter, data) =>
  Contact.findOneAndUpdate(filter, data);

export const removeContact = (filter) => Contact.findOneAndDelete(filter);
