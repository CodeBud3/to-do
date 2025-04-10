import { Schema } from "mongoose";

export const applyTransform = (schema: Schema) => {
  const transform = (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  };

  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform,
  });

  schema.set("toObject", {
    virtuals: true,
    versionKey: false,
    transform,
  });
};
