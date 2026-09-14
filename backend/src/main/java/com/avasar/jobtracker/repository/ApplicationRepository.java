package com.avasar.jobtracker.repository;

import com.avasar.jobtracker.entity.Application;
import com.avasar.jobtracker.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByUserId(Long userId);

    List<Application> findByUserIdAndStatus(
            Long userId,
            ApplicationStatus status
    );

    boolean existsByUserIdAndJobId(Long userId, Long jobId);
}