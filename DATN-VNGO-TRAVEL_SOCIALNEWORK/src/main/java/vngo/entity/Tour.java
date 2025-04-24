package vngo.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tour")
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "decription")
    String decription;

    @Column(name = "create_at")
    LocalDateTime createdAt;  // LocalDateTime cho createdAt và modifiedAt

    @Column(name = "modified_at")
    LocalDateTime modifiedAt;

    @Column(name = "start_date")
    LocalDate startDate;  // LocalDate cho startDate và endDate

    @Column(name = "end_date")
    LocalDate endDate;  // LocalDate cho startDate và endDate
    
    @Column(name = "address")
    String address;

    @Column(name = "expense")
    Double expense;

    @Column(name = "quantity_member")
    Integer quantityMember ;

    @Column(name = "allowedtoapply")
    Boolean allowedToApply;

    @Column(name = "title")
    String title;
    
    @Column(name = "is_activated")
    Boolean isActivated;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "create_by", referencedColumnName = "id", nullable = false)
    private Account createBy;

    @JsonManagedReference
    @OneToMany(mappedBy = "tour")  // mappedBy liên kết với thuộc tính 'tour' trong LocationDetail
    private List<LocationDetail> locationDetails;  // Một tour có nhiều locationDetails

    @JsonIgnore
    @OneToMany(mappedBy = "tour")  
    private List<Blog> blog;
}

