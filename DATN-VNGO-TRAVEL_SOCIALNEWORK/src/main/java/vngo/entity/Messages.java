package vngo.entity;

import vngo.ultil.CommunicationStatus;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties("account") // Bỏ qua thuộc tính `account` trong Messages

public class Messages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "Sender_id", nullable = false)
    private Account sender;
    
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "Recipient_id", nullable = false)
    private Account recipient;

    @Column(name = "Content", nullable = false)
    private String content;

    @Column(name = "Sent_at", nullable = false)
    private LocalDateTime sentAt = LocalDateTime.now();
    
    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private CommunicationStatus status;
    
    @Column(name = "sender_status")
    Boolean senderStatus;
    
    @Column(name = "recipient_status")
    Boolean recipientStatus;

}
