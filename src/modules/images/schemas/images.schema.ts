import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  alt: string;

  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;

  @Prop()
  cloudinaryPublicId: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
