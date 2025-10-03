package com.complaint.demo.controller;

import com.complaint.demo.model.User;
import com.complaint.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // React frontend
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return this.userService.addUser(user);
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        System.out.println("Received username: '" + username + "'");
        System.out.println("Received password: '" + password + "'");

        Optional<User> loggedInUser = this.userService.checkLogin(username, password);

        Map<String, Object> response = new HashMap<>();
        if (loggedInUser.isPresent()) {
            response.put("success", true);
            response.put("username", loggedInUser.get().getUsername());
            response.put("role", loggedInUser.get().getRole());
        } else {
            response.put("success", false);
            response.put("message", "Invalid username or password");
        }

        return ResponseEntity.ok(response);
    }

}
