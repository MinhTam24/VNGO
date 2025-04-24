package vngo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import vngo.entity.Roles;

public interface RoleRepository extends JpaRepository<Roles, Long> {
	@Query(" SELECT r.name FROM Roles r JOIN AccountRoles ur ON r.id = ur.role.id JOIN Account u ON u.id = ur.account.id WHERE u.email = :email")
	List<String> findRoleNameByAccountEmail(String email);
}
