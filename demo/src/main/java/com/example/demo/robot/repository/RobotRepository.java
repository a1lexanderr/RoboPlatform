package com.example.demo.robot.repository;

import com.example.demo.robot.domain.Robot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RobotRepository extends JpaRepository<Robot, Long> {
}
