import { IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product-entity.model';

@Entity({ name: 'category_table' })
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  @IsString()
  category_name: string;

  @OneToMany(() => Product, (product) => product.category, {
    onDelete: 'CASCADE',
  })
  products?: Product[];
}
