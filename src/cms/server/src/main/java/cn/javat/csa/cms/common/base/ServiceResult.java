package cn.javat.csa.cms.common.base;


import cn.javat.csa.cms.common.enums.ServiceResCode;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceResult<T> {
    @Builder.Default
    private int code = ServiceResCode.UNKNOWN_ERROR.getCode();
    @Builder.Default
    private boolean isSuccess = false;
    @Builder.Default
    private String message = "";
    private T data;
}
