import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UNKNOWN, LOCAL_PROVIDER } from './users.constants';
import { encryptPassword, generateToken } from './users.functions';

export interface User {
  id?: string;
  provider: string;
  username: string;
  password: string;
  fullName: string;
  email: string;
  activationCode?: string;
  resetPasswordCode?: string;
  isVerified: boolean;
  isActive: boolean;
  paymentsCustomerId?: string;
  paymentsProvider?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type UserAvailable = { providerId?: string } & Omit<
  Optional<User, 'username'>,
  'password' | 'activationCode' | 'resetPasswordCode'
>;

@Entity()
@Unique('provider-username', ['username', 'provider'])
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, default: LOCAL_PROVIDER })
  provider: string;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 150 })
  password: string;

  @Column({ type: 'varchar', length: 70 })
  fullName: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  activationCode?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  resetPasswordCode?: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  paymentsCustomerId?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  paymentsProvider?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  private tempPassword: string;

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  async beforeInsert() {
    this.password = await encryptPassword(this.password);
    this.activationCode = generateToken();
    this.isVerified = this.email === UNKNOWN;
  }

  @BeforeUpdate()
  async beforeUpdate() {
    if (this.tempPassword !== this.password) {
      this.password = await encryptPassword(this.password);
    }
  }
}
