package cn.javat.csa.cms.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 排序顺序枚举
 */
@AllArgsConstructor
@Getter
public enum SortOrder {
    ASC("asc", "升序"),
    DESC("desc", "降序");

    private final String value;
    private final String description;

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static SortOrder fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return DESC;
        }
        for (SortOrder order : values()) {
            if (order.value.equalsIgnoreCase(value)) {
                return order;
            }
        }
        return DESC;
    }
}
