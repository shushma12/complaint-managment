package com.complaint.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long complaint_id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true) // nullable if anonymous complaint allowed
    private User user;

    @Column(nullable = false, length = 200)
    private String name; // student's name (redundant copy for quick viewing)

    @Column(nullable = false, length = 100)
    private String department;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Category category;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status;

    @Column(length = 512)
    private String photo_path; // optional photo attachment

    @Column(columnDefinition = "TEXT")
    private String resolution_notes;

    @Column(nullable = false)
    private LocalDateTime created_at = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updated_at = LocalDateTime.now();

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}
