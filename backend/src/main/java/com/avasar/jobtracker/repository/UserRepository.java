package com.avasar.jobtracker.repository;

import com.avasar.jobtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
//    User user = UserRepository.findByEmail(String email)
//            .orElseThrow(() -> new RuntimeException("User not found"));
}
