package site.boostcareer.app.entity.User;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import site.boostcareer.app.entity.Catalog.CatalogRole;

@Entity
@Getter
@Setter
@Table(name="User_")
public class User {
    @Id
    @Column(name="User_ID",unique = true, length = 64, nullable = false)
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer userId;

    @Column(name="username", unique = true, length = 64, nullable = false)
    private String userName;

    private String email;

    @Column(name="pass",length=128)
    private String password;

    @ManyToOne
    @JoinColumn(name="role_id")
    private CatalogRole role;

}
