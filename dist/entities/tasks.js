var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Check, } from "typeorm";
import { User } from "./user.js";
let Task = class Task extends BaseEntity {
    id;
    title;
    description;
    status;
    // 👇 Relación correcta con User
    assigneeId;
    user;
    // 👇 Relación jerárquica con tareas
    parent;
    parentId;
    subtasks;
    createdAt;
    updatedAt;
    isParent() {
        return this.parentId === null;
    }
    isSubtask() {
        return this.parentId !== null;
    }
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Task.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    Column({
        type: "enum",
        enum: ["TO_DO", "IN_PROGRESS", "COMPLETED"],
        default: "TO_DO",
    }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    Column("int", { nullable: true }),
    __metadata("design:type", Object)
], Task.prototype, "assigneeId", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.tasks, { nullable: true }),
    JoinColumn({ name: "assigneeId" }) // 👈 aquí la clave para que TypeORM entienda la FK
    ,
    __metadata("design:type", Object)
], Task.prototype, "user", void 0);
__decorate([
    ManyToOne(() => Task, (task) => task.subtasks, {
        nullable: true,
        onDelete: "CASCADE",
    }),
    JoinColumn({ name: "parentId" }),
    __metadata("design:type", Object)
], Task.prototype, "parent", void 0);
__decorate([
    Column("int", { nullable: true }),
    __metadata("design:type", Object)
], Task.prototype, "parentId", void 0);
__decorate([
    OneToMany(() => Task, (task) => task.parent),
    __metadata("design:type", Array)
], Task.prototype, "subtasks", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Task.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Task.prototype, "updatedAt", void 0);
Task = __decorate([
    Entity(),
    Check(`"status" IN ('TO_DO', 'IN_PROGRESS', 'COMPLETED')`)
], Task);
export { Task };
//# sourceMappingURL=tasks.js.map