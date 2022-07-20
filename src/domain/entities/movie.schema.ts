import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Categories } from '../enums';

export interface Movie {
  id?: string;
  title: string;
  url: string;
  description?: string;
  categories: Categories[] | Set<Categories>;
  publishDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Entity()
@Index('movies-title', ['title'], { unique: true })
export class MovieEntity implements Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 150 })
  url: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: Categories, array: true, default: [] })
  categories: Categories[] | Set<Categories>;

  @Column({ type: 'timestamp', nullable: true })
  publishDate?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
