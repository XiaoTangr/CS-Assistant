package cn.javat.csa.cms.dto;


import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class BizPostDetailDTO extends BizPostDTO {
    private SysUserDTO author;

    /**
     * 构建器方法
     */
    public static BizPostDetailDTOBuilder builder() {
        return new BizPostDetailDTOBuilder();
    }

    public static class BizPostDetailDTOBuilder {
        private String title;
        private cn.javat.csa.cms.common.enums.BizPostType type;
        private String content;
        private Integer status;
        private Integer topOrder;
        private SysUserDTO author;

        public BizPostDetailDTOBuilder title(String title) {
            this.title = title;
            return this;
        }

        public BizPostDetailDTOBuilder type(cn.javat.csa.cms.common.enums.BizPostType type) {
            this.type = type;
            return this;
        }

        public BizPostDetailDTOBuilder content(String content) {
            this.content = content;
            return this;
        }

        public BizPostDetailDTOBuilder status(Integer status) {
            this.status = status;
            return this;
        }

        public BizPostDetailDTOBuilder topOrder(Integer topOrder) {
            this.topOrder = topOrder;
            return this;
        }

        public BizPostDetailDTOBuilder author(SysUserDTO author) {
            this.author = author;
            return this;
        }

        public BizPostDetailDTO build() {
            BizPostDetailDTO dto = new BizPostDetailDTO();
            dto.setTitle(this.title);
            dto.setType(this.type);
            dto.setContent(this.content);
            dto.setStatus(this.status);
            dto.setTopOrder(this.topOrder);
            dto.setAuthor(this.author);
            return dto;
        }
    }
}
