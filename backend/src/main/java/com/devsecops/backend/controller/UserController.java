package com.devsecops.backend.controller;

import com.devsecops.backend.entity.user;
import com.devsecops.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

  private final UserRepository userRepository;

  public UserController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @PostMapping
  public ResponseEntity<?> createUser(@RequestBody user user) {

    if (userRepository.existsByUsername(user.getUsername())) {
      return ResponseEntity.badRequest()
        .body("Nom d'utilisateur déjà utilisé.");
    }

    if (userRepository.existsByEmail(user.getEmail())) {
      return ResponseEntity.badRequest()
        .body("Email déjà utilisé.");
    }

    user savedUser = userRepository.save(user);

    return ResponseEntity.ok(savedUser);
  }
  @GetMapping("/health")
  public ResponseEntity<String> health() {
    return ResponseEntity.ok("Backend is running");
  }
}
