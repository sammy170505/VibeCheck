import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: "qbyOUNH_-5WjYtKfaQkA9nuctUbrMclRZTKIiVuwsZEH4s-5ISmXaCtyQCBqj0VW",
});

export const uploadFileToPinata = async (fileUri, fileName) => {
  const response = await pinata.files.upload(fileUri, fileName);
  return response;
};

export const uploadJSONToPinata = async (jsonData, fileName) => {
  const response = await pinata.files.upload(JSON.stringify(jsonData), fileName);
  return response;
};

export const listUsers = async () => {
  const files = await pinata.files.list().name("_data.json");
  return files.map(file => JSON.parse(file.content));
};

export const createGroup = async (userId) => {
  return await pinata.groups.create({ name: `circle_${userId}` });
};

export const addUserToGroup = async (groupOwnerId, userId) => {
  const group = await pinata.groups.get({ groupId: `circle_${groupOwnerId}` });
  await pinata.groups.addFile({ groupId: group.id, fileId: `${userId}_data.json` });
};

export const removeUserFromGroup = async (groupOwnerId, userId) => {
  const group = await pinata.groups.get({ groupId: `circle_${groupOwnerId}` });
  await pinata.groups.removeFile({ groupId: group.id, fileId: `${userId}_data.json` });
};

export const deleteUserData = async (userId) => {
  const files = await pinata.files.list().name(`${userId}_`);
  for (const file of files) {
    await pinata.files.delete({ fileId: file.id });
  }
};