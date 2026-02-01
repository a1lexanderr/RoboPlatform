package com.example.demo.robot.controller;

import com.example.demo.robot.dto.RobotResponseDTO;
import com.example.demo.robot.service.RobotService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/robots")
@Slf4j
public class RobotController {

    private final RobotService robotService;

    public RobotController(RobotService robotService) {
        this.robotService = robotService;
    }

//    @GetMapping("/{robotId}")
//    public ResponseEntity<RobotResponseDTO> getRobotById(@PathVariable Long robotId) {
//        log.info("Запрос на получение робота по ID: {}", robotId);
//        RobotResponseDTO robot = robotService.findRobotById(robotId);
//        return ResponseEntity.ok(robot);
//    }
}