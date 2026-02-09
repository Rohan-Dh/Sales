import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: "sales"})
@Index(['agentName'])
export class  Sales {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({type: 'text'})
  agentName: string;

  @Column({type: 'numeric', precision: 18, scale: 2})
  amountSold: string;

  @Column({type: 'int'})
  salesCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
