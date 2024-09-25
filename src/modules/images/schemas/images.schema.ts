import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema({ timestamps: true })
export class Image {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  section: string;

  @Prop({ required: true })
  subsection: string;

  @Prop({ required: true })
  alt: string;

  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  cloudinary_public_id: string;

  @Prop()
  link: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
