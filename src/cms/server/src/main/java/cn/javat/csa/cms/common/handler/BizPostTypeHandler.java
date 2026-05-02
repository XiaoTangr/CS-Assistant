package cn.javat.csa.cms.common.handler;

import cn.javat.csa.cms.common.enums.BizPostType;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * 文章类型枚举类型处理器
 * 将数据库中的数字 code 转换为 BizPostType 枚举
 */
public class BizPostTypeHandler extends BaseTypeHandler<BizPostType> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, BizPostType parameter, JdbcType jdbcType) throws SQLException {
        ps.setInt(i, parameter.getCode());
    }

    @Override
    public BizPostType getNullableResult(ResultSet rs, String columnName) throws SQLException {
        int code = rs.getInt(columnName);
        if (rs.wasNull()) {
            return null;
        }
        return BizPostType.fromCode(code);
    }

    @Override
    public BizPostType getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        int code = rs.getInt(columnIndex);
        if (rs.wasNull()) {
            return null;
        }
        return BizPostType.fromCode(code);
    }

    @Override
    public BizPostType getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        int code = cs.getInt(columnIndex);
        if (cs.wasNull()) {
            return null;
        }
        return BizPostType.fromCode(code);
    }
}
