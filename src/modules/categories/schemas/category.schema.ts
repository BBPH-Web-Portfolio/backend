import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Image } from 'src/modules/images/schemas/images.schema';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({ required: true })
  title: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }])
  images: Image[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
