import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Image' }] })
  images: Types.Array<Types.ObjectId>;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
