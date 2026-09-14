package com.avasar.jobtracker.repository;

import com.avasar.jobtracker.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository
        extends JpaRepository<Job, Long> {

    List<Job> findAllByOrderByPostedAtDesc();
}