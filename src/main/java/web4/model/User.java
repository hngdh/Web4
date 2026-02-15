package web4.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 10)
    private String groupNumber;

    @Column(nullable = false)
    private boolean enabled = true;

    public User(String username, String password, String groupNumber) {
        this.username = username;
        this.password = password;
        this.groupNumber = groupNumber;
    }
}
