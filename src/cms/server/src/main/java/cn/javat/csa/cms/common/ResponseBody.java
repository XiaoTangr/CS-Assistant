package cn.javat.csa.cms.common;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * 系统统一返回对象
 * @param <T> data数据类型
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public class ResponseBody<T> {

    private int code;
    private String message;
    private T data;

    // 重新 toString 返回 Json
    @Override
    public String toString() {
        try {
            ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
            return objectMapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
//            发生异常则使用字符串拼接
            if (data != null) {
                return "{\"code\":" + code + ",\"message\":\"" + message + "\",\"data\":" + data + "}";
            }
            return "{\"code\":" + code + ",\"message\":\"" + message + "\"}";
        }
    }
}
