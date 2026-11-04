
package com.ads.conciliamei.controller;

import com.ads.conciliamei.domain.user.User;
import com.ads.conciliamei.dto.LoginRequestDTO;
import com.ads.conciliamei.dto.RegisterRequestDTO;
import com.ads.conciliamei.dto.ResponseDTO;
import com.ads.conciliamei.infra.security.TokenService;
import com.ads.conciliamei.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO body) {

        Optional<User> user = repository.findByEmail(body.email());

        if (user.isEmpty() ||
                !passwordEncoder.matches(body.password(), user.get().getPassword())) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("E-mail ou senha incorretos.");
        }

        String token = tokenService.generateToken(user.get());

        return ResponseEntity.ok(
                new ResponseDTO(user.get().getName(), token)
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO body) {

        Optional<User> existingUser = repository.findByEmail(body.email());

        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Este e-mail já está cadastrado.");
        }

        User newUser = new User();
        newUser.setPassword(passwordEncoder.encode(body.password()));
        newUser.setEmail(body.email());
        newUser.setName(body.name());

        repository.save(newUser);

        String token = tokenService.generateToken(newUser);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseDTO(newUser.getName(), token));
    }
}
