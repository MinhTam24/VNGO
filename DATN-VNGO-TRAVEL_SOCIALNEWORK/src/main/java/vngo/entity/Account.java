package vngo.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vngo.ultil.AccountStatus;
import vngo.ultil.Gender;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "account")
@JsonIgnoreProperties("messages")
public class Account {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "password", nullable = false)
	private String passWord;

	@Column(name = "first_name")
	private String firstName;

	@Column(name = "full_name")
	private String fullName;

	@Column(name = "birthday")
	private LocalDate birthday;

	@Column(name = "created_date")
	private LocalDateTime createDate;

	private String address;
	private String phone;

	@Column(name = "is_activated")
	private boolean isActivated = true;

	@Enumerated(EnumType.STRING)
	@Column(name = "gender")
	private Gender gender;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "Created_by")
	private Account createdBy;
	
	@JsonIgnore
	@OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
	private List<Messages> sentMessages;
	
	@JsonIgnore
	@OneToMany(mappedBy = "recipient", fetch = FetchType.LAZY)
	private List<Messages> receivedMessages;
	
	@JsonIgnore
	@OneToMany(mappedBy = "sender")
	private List<Notification> sentNotification;
	
	@JsonIgnore
	@OneToMany(mappedBy = "recipient")
	private List<Notification> receivedNotification;
	
	@Enumerated(EnumType.STRING)
	@Column(name= "status")
	AccountStatus status;
	
	@JsonManagedReference
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "user_hobbies", joinColumns = @JoinColumn(name = "account_id"), inverseJoinColumns = @JoinColumn(name = "hobby_id"))
	private List<Hobby> hobbys;
	
	@JsonIgnore
    @OneToMany(mappedBy = "createBy")  
    private List<Blog> blog;
	
	@JsonIgnore
    @OneToMany(mappedBy = "createdBy")  
    private List<Likes> likes;
	
	@JsonIgnore
    @OneToMany(mappedBy = "createdBy")  
    private List<Comment> comment;
	
	@JsonIgnore
    @OneToMany(mappedBy = "createBy")  
    private List<Tour> tour;
	
	@JsonManagedReference
	@OneToMany(mappedBy = "followed")
	private List<Follow> followed;
	
	@JsonManagedReference
	@OneToMany(mappedBy = "follower")
	private List<Follow> follower;
	
	@Override
	public String toString() {
	    return "Account{id=" + id + "}";
	}
	

}
