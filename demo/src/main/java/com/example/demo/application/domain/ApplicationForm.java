package com.example.demo.application.domain;

import com.example.demo.common.BaseEntity;
import com.example.demo.competition.domain.Competition;
import com.example.demo.team.domain.Team;
import com.example.demo.user.domain.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Getter
@Setter
@ToString(exclude = {"team", "competition", "reviewedBy"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "application_forms")
public class ApplicationForm extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id")
    private Competition competition;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @Column(name = "team_experience")
    private String teamExperience;

    @Column(name = "robot_specifications", columnDefinition = "TEXT")
    private String robotSpecifications;

    @Column(name = "additional_equipment", columnDefinition = "TEXT")
    private String additionalEquipment;

    @Column(name = "special_requirements")
    private String specialRequirements;

    @Column(name = "admin_comment", columnDefinition = "TEXT")
    private String adminComment;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        ApplicationForm that = (ApplicationForm) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
