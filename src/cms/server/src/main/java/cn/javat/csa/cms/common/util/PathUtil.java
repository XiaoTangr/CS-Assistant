package cn.javat.csa.cms.common.util;

import org.springframework.util.AntPathMatcher;

/**
 * 路径匹配工具（支持 /** 通配符）
 */
public class PathUtil {
    private static final AntPathMatcher matcher = new AntPathMatcher();

    // 匹配 /api/v1/post/{id} 这种格式
    public static boolean match(String pattern, String uri) {
        return matcher.match(pattern, uri);
    }
}