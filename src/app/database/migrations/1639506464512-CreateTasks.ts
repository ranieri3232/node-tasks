/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export enum TaskPriority{
  DEFAULT = 'DEFAULT',
  WARNING = 'WARNING',
  DANGER = 'DANGER'
}

export class CreateTasks1639506464512 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'tasks',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          default: 'uuid_generate_v4()',
        },
        {
          name: 'title',
          type: 'varchar',
        },
        {
          name: 'description',
          type: 'varchar',
        },
        {
          name: 'priority',
          type: 'enum',
          enum: [TaskPriority.DEFAULT, TaskPriority.WARNING, TaskPriority.DANGER],
          enumName: 'priorityEnum',
        },
        {
          name: 'user_id',
          type: 'uuid',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
      foreignKeys: [
        {
          name: 'fk_user_tasks',
          columnNames: ['user_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // const table = await queryRunner.getTable('Tasks');
    // eslint-disable-next-line max-len
    // const foreignKey = await table.foreignKeys.find((fk) => fk.columnNames.indexOf('user_id') !== -1);
    // await queryRunner.dropForeignKey('Tasks', foreignKey);
    await queryRunner.dropForeignKey('tasks', 'fk_user_tasks');
    await queryRunner.dropTable('tasks');
  }
}
