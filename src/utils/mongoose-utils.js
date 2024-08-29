import { Model } from "mongoose";
import { ObjectId } from "bson";

export const existsByQuery = (Type, query) => Type.exists(query);

export const insertOne = (Type, object) => Type.create(object);

export const findOneByQuery = (Type, query, projection) =>
  Type.findOne(query, projection).lean();

export const findById = (Type, id, projection = {}, idKey = "_id") => {
  return findOneByQuery(Type, { [idKey]: id }, projection);
};

export const findOneAndUpdate = (Type, query, updateObject) => {
  return Type.findOneAndUpdate(query, updateObject, { new: true });
};

// we can implement with sort, limit, query but not mentioned in doc
export const findAllByQuery = (Type, query, projection = {}) => {
  return Type.find(query, projection);
};

export const findByQueryWithOptions = (
  Type,
  query,
  projection = {},
  sortQuery = {},
  limit = 100,
  skip = 0
) => {
  return Type.find(query, projection).sort(sortQuery).skip(skip).limit(limit);
};

export const deleteOneByQuery = (Type, query) => {
  return Type.deleteOne(query);
};

export const deleteMultipleByQuery = (Type, query) => {
  return Type.deleteMany(query);
};

export const deleteOneById = (Type, id, idKey = "_id") => {
  return deleteOneByQuery(Type, { [idKey]: id });
};

export const isMongooseObject = (object) => {
  return object instanceof Model;
};

export const getNewObjectId = () => new ObjectId();
