package com.flogin.repository;

import com.flogin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by username
     * 
     * @param username username to search
     * @return Optional containing User if found
     */
    Optional<User> findByUsername(String username);

    /**
     * Check if username exists
     * 
     * @param username username to check
     * @return true if exists
     */
    boolean existsByUsername(String username);
}
