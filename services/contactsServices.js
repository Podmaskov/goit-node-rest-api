import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

const updateContacts = (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export async function getContacts() {
  const contactsBuffer = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(contactsBuffer) || [];
}

export async function getContactById(contactId) {
  const contacts = await getContacts();
  return contacts.find(({ id }) => id === contactId) || null;
}

export async function addContact({ name, email, phone }) {
  const contacts = await getContacts();
  const newContact = { id: nanoid(), name, email, phone };
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
}

export const updateContactById = async (id, data) => {
  const contacts = await getContacts();
  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  contacts[index] = { ...contacts[index], ...data };
  await updateContacts(contacts);

  return contacts[index];
};

export async function removeContact(contactId) {
  const contacts = await getContacts();
  const idx = contacts.findIndex(({ id }) => id === contactId);
  if (idx === -1) {
    return null;
  }
  const deletedContact = contacts.splice(idx, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return deletedContact;
}
