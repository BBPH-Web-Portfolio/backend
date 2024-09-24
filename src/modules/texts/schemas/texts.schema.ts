import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Languages } from 'src/constants/constants';

export type TextDocument = Text & Document;

@Schema()
export class Text {
  @Prop({ type: String, enum: Languages })
  language: Languages;

  @Prop({ type: String })
  section: string;

  @Prop({ type: String })
  subsection: string;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String, required: false })
  body?: string;

  @Prop({ type: Number })
  max_length_title: number;

  @Prop({ type: Number })
  max_length_body: number;
}

export const TextSchema = SchemaFactory.createForClass(Text);
