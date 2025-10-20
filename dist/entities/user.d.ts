import { BaseEntity } from "typeorm";
export declare class User extends BaseEntity {
    id: number;
    firstname: string;
    lastname: string;
    active: boolean;
    tasks: any[];
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=user.d.ts.map