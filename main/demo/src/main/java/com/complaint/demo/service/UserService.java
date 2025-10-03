package com.complaint.demo.service;

import com.complaint.demo.model.User;
import com.complaint.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    public User addUser(User user) {
        return userRepository.save(user);
    }


    public Optional<User> checkLogin(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username.trim());
        if (userOpt.isPresent()) {
            String dbPassword = userOpt.get().getPassword().trim();
            if (dbPassword.equals(password.trim())) {
                return userOpt;
            }
        }
        return Optional.empty();
    }

}
