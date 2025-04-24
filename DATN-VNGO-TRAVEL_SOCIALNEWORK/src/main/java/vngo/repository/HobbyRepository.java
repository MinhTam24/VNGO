package vngo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vngo.entity.Account;
import vngo.entity.Hobby;

@Repository
public interface HobbyRepository extends JpaRepository<Hobby, Long>{
   Optional<Hobby> findByName(String name);
}