package vngo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vngo.entity.Account;
import vngo.entity.Follow;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long>{
	
	@Query("SELECT f FROM Follow f WHERE f.follower.id = :followerId AND f.followed.id = :followedId")
    Follow findByFollowerAndFollowed(@Param("followerId") Long followerId, @Param("followedId") Long followedId);
	
	@Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Follow f WHERE f.follower.id = :followerId AND f.followed.id = :followedId")
	boolean existsByFollowerAndFollowed(@Param("followerId") Long followerId, @Param("followedId") Long followedId);

	@Query("SELECT a FROM Account a " +
		       "WHERE a.id != :followerId AND a.id NOT IN (" +
		       "    SELECT f.followed.id FROM Follow f WHERE f.follower.id = :followerId)")
		List<Account> findAccountsNotFollowedBy(@Param("followerId") Long followerId);
	
	@Query("SELECT DISTINCT a FROM Account a " +
		       "JOIN Follow f ON a.id = f.followed.id " +
		       "WHERE f.follower.id = :followerId")
		List<Account> findAccountsFollowedBy(@Param("followerId") Long followerId);

}