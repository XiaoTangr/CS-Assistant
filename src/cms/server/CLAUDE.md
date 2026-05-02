# 项目规范

## Swagger 注解规范
- DTO/VO 类使用 `@Schema(description = "xxx")` 描述类用途，不使用 JavaDoc 注释
- 字段使用 `@Schema(description = "描述", example = "示例值")` 注解
- 类注释可以保留 @author 等必要信息

## 本项目已完成的任务
- 2026-04-24: 优化 DTO/VO 的 Swagger 注解，清理了 SysNoticeDTO 和 SysNoticeVO 中多余的 JavaDoc 注释