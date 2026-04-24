package cn.javat.csa.cms.util;

import cn.javat.csa.cms.vo.Sys.SysUserVO;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;

/**
 * JWT 工具类
 */
@Component
public class JwtUtil {

    // 从配置文件中获取密钥和过期时间
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration:3600}")
    private Long expiration;

    // 静态变量，供静态方法使用
    private static String jwtSecret;
    private static Long jwtExpiration;

    /**
     * Spring 容器初始化后调用，设置静态变量
     */
    @PostConstruct
    public void init() {
        jwtSecret = this.secret;
        jwtExpiration = this.expiration;
    }

    /**
     * 生成 JWT Token
     *
     * @param userId   用户 ID
     * @param username 用户名
     * @param role     用户角色（数字或字符串）
     * @return JWT Token
     */
    public static String generateToken(String userId, String username, Object role) {
        Instant now = Instant.now();
        Instant expireTime = now.plus(Duration.ofSeconds(jwtExpiration));

        return JWT.create()
                .withClaim("userId", userId)
                .withClaim("username", username)
                .withClaim("role", role.toString())
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(expireTime))
                .sign(Algorithm.HMAC256(jwtSecret));
    }

    /**
     * 验证并解析 JWT Token
     *
     * @param token JWT Token
     * @return DecodedJWT 对象，验证失败返回 null
     */
    public static DecodedJWT verifyToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
            JWTVerifier verifier = JWT.require(algorithm).build();
            return verifier.verify(token);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 从 Token 中获取用户 ID
     *
     * @param token JWT Token
     * @return 用户 ID
     */
    public static String getUserIdFromToken(String token) {
        DecodedJWT decodedJWT = verifyToken(token);
        if (decodedJWT != null) {
            return decodedJWT.getClaim("userId").asString();
        }
        return null;
    }

    /**
     * 从 Token 中获取用户名
     *
     * @param token JWT Token
     * @return 用户名
     */
    public static String getUsernameFromToken(String token) {
        DecodedJWT decodedJWT = verifyToken(token);
        if (decodedJWT != null) {
            return decodedJWT.getClaim("username").asString();
        }
        return null;
    }

    /**
     * 检查 Token 是否过期
     *
     * @param token JWT Token
     * @return true-未过期，false-已过期
     */
    public static boolean isTokenExpired(String token) {
        DecodedJWT decodedJWT = verifyToken(token);
        if (decodedJWT != null) {
            return decodedJWT.getExpiresAt().before(new Date());
        }
        return true;
    }


    /**
     * 从SysUser创建JWT
     *
     * @param sysUserVo 系统用户
     * @return JWT
     */
    public static String generateToken(SysUserVO sysUserVo) {
        return JwtUtil.generateToken(sysUserVo.getId().toString(), sysUserVo.getUsername(), sysUserVo.getRole());
    }
}
