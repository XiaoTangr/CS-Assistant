package cn.javat.csa.cms.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 排序字段枚举
 */
@AllArgsConstructor
@Getter
public enum SortField {
    DEFAULT("default", "默认排序"),
    CREATE_TIME("createTime", "创建时间"),
    UPDATE_TIME("updateTime", "更新时间");

    private final String value;
    private final String description;

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static SortField fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return DEFAULT;
        }
        for (SortField field : values()) {
            if (field.value.equalsIgnoreCase(value)) {
                return field;
            }
        }
        return DEFAULT;
    }
}
