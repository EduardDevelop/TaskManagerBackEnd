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

  @ManyToOne("User", "tasks")
  user: any;

@Column("int", { nullable: true })
assigneeId: number | null;

  @ManyToOne("Task", "subtasks", {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "parentId" })
  parent: Task | null;

  @Column("int", { nullable: true })
  parentId: number | null;

  @OneToMany("Task", "parent")
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
