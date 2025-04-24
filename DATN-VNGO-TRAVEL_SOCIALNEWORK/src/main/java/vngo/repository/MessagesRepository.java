package vngo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vngo.entity.Account;
import vngo.entity.Messages;
import vngo.ultil.CommunicationStatus;

@Repository
public interface MessagesRepository extends JpaRepository<Messages, Long> {
	List<Messages> findBySenderIdAndRecipientId(Long senderId, Long recipientId);

	List<Messages> findBySenderIdAndRecipientIdAndStatus(Long senderId, Long recipientId,CommunicationStatus communicationStatus);

	List<Messages> findBySenderAndRecipientAndSenderStatusTrue(Account sender, Account recipient);

	List<Messages> findBySenderAndRecipientAndRecipientStatusTrue(Account recipient, Account sender);
	@Query("SELECT m FROM Messages m " + 
		       "WHERE ((m.sender.id = :senderId AND m.recipient.id = :recipientId AND m.senderStatus = true) " +
		       "OR (m.sender.id = :recipientId AND m.recipient.id = :senderId AND m.recipientStatus = true)) " + 
		       "ORDER BY m.sentAt DESC")
		List<Messages> findLastMessage(@Param("senderId") Long senderId, 
		                               @Param("recipientId") Long recipientId, 
		                               Pageable pageable);

	@Query("SELECT COUNT(m) FROM Messages m " + "WHERE (m.sender.id = :senderId AND m.recipient.id = :recipientId) "
			+ "AND m.status = :status")
	long countUnreadMessages(@Param("senderId") Long senderId, @Param("recipientId") Long recipientId,
			@Param("status") CommunicationStatus status);
	
	@Query("SELECT COUNT(m) FROM Messages m " + "WHERE  m.recipient.id = :recipientId "
			+ "AND m.status = :status")
	long countAllUnreadMessages(@Param("recipientId") Long recipientId,
			@Param("status") CommunicationStatus status);
	
	

	@Modifying
	    @Transactional
	    @Query("UPDATE Messages m " +
	           "SET m.senderStatus = CASE " +
	           "   WHEN m.sender.id = :senderId AND m.recipient.id = :recipientId THEN false " +
	           "   ELSE m.senderStatus " +
	           "END, " +
	           "m.recipientStatus = CASE " +
	           "   WHEN m.recipient.id = :senderId AND m.sender.id = :recipientId THEN false " +
	           "   ELSE m.recipientStatus " +
	           "END " +
	           "WHERE (m.sender.id = :senderId AND m.recipient.id = :recipientId) OR (m.recipient.id = :senderId AND m.sender.id = :recipientId)")
	    void updateStatuses(@Param("senderId") Long senderId, @Param("recipientId") Long recipientId);

}
