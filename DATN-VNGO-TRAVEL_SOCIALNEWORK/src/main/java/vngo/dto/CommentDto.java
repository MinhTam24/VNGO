package vngo.dto;

import javax.swing.text.AbstractDocument.Content;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vngo.entity.Account;
import vngo.entity.Blog;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
	Long id;
	Long blogOwner;
	Long accountId;
	Long blogId;
	String fullName;
	String avatar;
	String content;
	String createdAt;
	Boolean isActivated;

	public CommentDto(Long id, Long blogOwner, Long accountId, Long blogId, String fullName, String avatar,
			String content, String createdAt) {
		super();
		this.id = id;
		this.blogOwner = blogOwner; 
		this.accountId = accountId;
		this.blogId = blogId;
		this.fullName = fullName;
		this.avatar = avatar;
		this.content = content;
		this.createdAt = createdAt;
	}

}
