package site.boostcareer.app.entity.Catalog;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import site.boostcareer.app.entity.User.User;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="catalog_role")
public class CatalogRole {
    @Id
    private Byte role_id;

    @Column(unique = true, length = 64, nullable = false)
    private String role_name;

    @OneToMany(mappedBy = "role")
    private List<User> Users;
}
