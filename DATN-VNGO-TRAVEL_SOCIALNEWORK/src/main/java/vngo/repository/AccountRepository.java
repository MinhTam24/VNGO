package vngo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vngo.entity.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

	Optional<Account> findByEmail(String email);
//
//	@Query("""
//			    SELECT DISTINCT a
//			    FROM Account a
//			    WHERE a.id != :accountId AND (
//			        EXISTS (
//			            SELECT 1
//			            FROM Messages m
//			            WHERE (m.sender.id = :accountId AND m.recipient.id = a.id)
//			               OR (m.recipient.id = :accountId AND m.sender.id = a.id)
//			        )
//			    )
//			""")
//	List<Account> findContactWithAccount(@Param("accountId") Long accountId);
//	
	
	
	@Query("SELECT a FROM Account a "
			+ "WHERE LOWER(a.firstName) LIKE LOWER(CONCAT('%', :searchText, '%')) "
			+ "OR LOWER(a.fullName) LIKE LOWER(CONCAT('%', :searchText, '%'))"
			+	"OR LOWER(a.phone) LIKE LOWER(CONCAT('%', :searchText, '%'))"
			+	"OR LOWER(a.email) LIKE LOWER(CONCAT('%', :searchText, '%'))"
			)
	List<Account> searchAccounts(@Param("searchText") String searchText);
	
	
	
	
	
	@Query("""
		    SELECT DISTINCT a
		    FROM Account a
		    WHERE a.id != :accountId AND (
		            EXISTS (
		                SELECT 1
		                FROM Messages m
		                WHERE (m.sender.id = :accountId AND m.recipient.id = a.id AND m.senderStatus = true)
		                   OR (m.recipient.id = :accountId AND m.sender.id = a.id AND m.recipientStatus = true)
		            )
		        )
		""")
		List<Account> findContactWithAccount(@Param("accountId") Long accountId);

	
	
	
	
}
