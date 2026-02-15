package web4.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "points")
@Getter
@Setter
@NoArgsConstructor
public class Point {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_point_user"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Column(nullable = false, precision = 10, scale = 4)
    private BigDecimal x;

    @Column(nullable = false, precision = 10, scale = 4)
    private BigDecimal y;

    @Column(nullable = false, precision = 10, scale = 4)
    private BigDecimal r;

    @Column(nullable = false)
    private boolean hit;

    @Column(name = "calc_time", nullable = false)
    private BigDecimal calcTime;

    @Column(name = "release_time", nullable = false)
    private LocalDateTime releaseTime;

    public Point(User user, BigDecimal x, BigDecimal y, BigDecimal r, boolean hit, BigDecimal calcTime) {
        this.user = user;
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.calcTime = calcTime;
        this.releaseTime = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (releaseTime == null) {
            releaseTime = LocalDateTime.now();
        }
    }
}
