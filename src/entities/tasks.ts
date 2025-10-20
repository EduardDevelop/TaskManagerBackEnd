import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Check,
} from "typeorm";
import { User } from "./user.js";

export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "COMPLETED";

@Entity()
@Check(`"status" IN ('TO_DO', 'IN_PROGRESS', 'COMPLETED')`)
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: ["TO_DO", "IN_PROGRESS", "COMPLETED"],
    default: "TO_DO",
  })
  status: TaskStatus;

  // 👇 Relación correcta con User
  @Column("int", { nullable: true })
  assigneeId: number | null;

  @ManyToOne(() => User, (user) => user.tasks, { nullable: true })
  @JoinColumn({ name: "assigneeId" }) // 👈 aquí la clave para que TypeORM entienda la FK
  user: User | null;

  // 👇 Relación jerárquica con tareas
  @ManyToOne(() => Task, (task) => task.subtasks, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "parentId" })
  parent: Task | null;

  @Column("int", { nullable: true })
  parentId: number | null;

  @OneToMany(() => Task, (task) => task.parent)
  subtasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  isParent(): boolean {
    return this.parentId === null;
  }

  isSubtask(): boolean {
    return this.parentId !== null;
  }
}
