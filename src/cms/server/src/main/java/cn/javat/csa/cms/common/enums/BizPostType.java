package cn.javat.csa.cms.common.enums;

import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

// 1. 加上 implements IEnum<Integer>
@AllArgsConstructor
@Getter
public enum BizPostType implements IEnum<Integer> {
    ARTICLE(0, "一般文章"),
    VIDEO_CONFIG(1, "视频设置"),
    CROSSHAIR_CONFIG(2, "准星设置"),
    KEY_BIND(3, "键位绑定"),
    OTHER(4, "其他");

    private final int code;
    @Getter
    private final String description;
    
    @JsonValue
    public int getCode() {
        return code;
    }

    // 2. 重写 getValue() 方法，告诉 MyBatis-Plus 用 code 匹配
    @Override
    public Integer getValue() {
        return this.code;
    }

    @JsonCreator
    public static BizPostType fromCode(int code) {
        for (BizPostType type : values()) {
            if (type.code == code) {
                return type;
            }
        }
        throw new IllegalArgumentException("未知的文章类型代码：" + code);
    }
}