// src/core/database/index.ts
// 导出数据库连接器
export { default as connecter } from './connector';

// 导出数据库基础CRUD操作
export { default as baseCRUD } from './baseCRUD';

// 导出数据库迁移功能
export { runMigrations } from './migrations';
