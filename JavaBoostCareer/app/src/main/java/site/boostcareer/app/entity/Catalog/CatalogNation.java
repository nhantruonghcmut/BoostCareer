package site.boostcareer.app.entity.Catalog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name="Catalog_Nation")
public class CatalogNation {
    @Id
    @Column(name="Nation_ID", nullable=false)
    private short id;

    @Column(name="Nation_name",  nullable=false, length=64,unique=true)
    private String nationName;
}
