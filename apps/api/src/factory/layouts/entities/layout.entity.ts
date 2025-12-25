import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Layout {
 
}

export type LayoutDocument = Layout & Document;
export const LayoutSchema = SchemaFactory.createForClass(Layout);
