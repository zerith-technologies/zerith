package dev.zerith.backend.repository;

import dev.zerith.backend.entity.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VeiculoRepository extends JpaRepository<Veiculo, UUID> {

    boolean existsByPlaca(String placa);

    Optional<Veiculo> findByPlaca(String placa);

    List<Veiculo> findByStatus(Veiculo.StatusVeiculo status);
}
