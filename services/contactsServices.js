import Contact from "../models/contact.js";

export const getContacts = (filter = {}, field = "") =>
  Contact.find(filter, field);

export const getContactById = (contactId) => Contact.findById(contactId);

export const addContact = (data) => Contact.create(data);

export const updateContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);

export const updateStatusContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);

export const removeContact = (contactId) =>
  Contact.findByIdAndDelete(contactId);
