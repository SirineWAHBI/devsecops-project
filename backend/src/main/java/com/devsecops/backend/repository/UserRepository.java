package com.devsecops.backend.repository;

import com.devsecops.backend.entity.user;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<user, Long> {

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);
}
