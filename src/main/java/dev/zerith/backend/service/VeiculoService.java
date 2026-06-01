package dev.zerith.backend.service;

import dev.zerith.backend.dto.VeiculoDTO;
import dev.zerith.backend.entity.Veiculo;
import dev.zerith.backend.repository.VeiculoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class VeiculoService {

    private final VeiculoRepository repository;

    @Transactional(readOnly = true)
    public List<VeiculoDTO.Response> listarTodos() {
        return repository.findAll()
                .stream()
                .map(VeiculoDTO.Response::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<VeiculoDTO.Response> listarPorStatus(Veiculo.StatusVeiculo status) {
        return repository.findByStatus(status)
                .stream()
                .map(VeiculoDTO.Response::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public VeiculoDTO.Response buscarPorId(UUID id) {
        Veiculo veiculo = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Veículo não encontrado: " + id));
        return VeiculoDTO.Response.from(veiculo);
    }

    @Transactional
    public VeiculoDTO.Response criar(VeiculoDTO.CreateRequest req) {
        String placa = req.getPlaca().toUpperCase().trim();

        if (repository.existsByPlaca(placa)) {
            throw new IllegalArgumentException("Placa já cadastrada: " + placa);
        }

        Veiculo veiculo = Veiculo.builder()
                .placa(placa)
                .apelido(req.getApelido())
                .marca(req.getMarca())
                .modelo(req.getModelo())
                .ano(req.getAno())
                .tipo(req.getTipo())
                .build();

        Veiculo salvo = repository.save(veiculo);
        log.info("Veículo cadastrado: {} — {}", salvo.getPlaca(), salvo.getId());
        return VeiculoDTO.Response.from(salvo);
    }

    @Transactional
    public VeiculoDTO.Response atualizar(UUID id, VeiculoDTO.UpdateRequest req) {
        Veiculo veiculo = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Veículo não encontrado: " + id));

        if (req.getApelido()   != null) veiculo.setApelido(req.getApelido());
        if (req.getMarca()     != null) veiculo.setMarca(req.getMarca());
        if (req.getModelo()    != null) veiculo.setModelo(req.getModelo());
        if (req.getAno()       != null) veiculo.setAno(req.getAno());
        if (req.getTipo()      != null) veiculo.setTipo(req.getTipo());
        if (req.getStatus()    != null) veiculo.setStatus(req.getStatus());
        if (req.getOdometroKm()!= null) veiculo.setOdometroKm(req.getOdometroKm());

        return VeiculoDTO.Response.from(repository.save(veiculo));
    }

    @Transactional
    public void remover(UUID id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Veículo não encontrado: " + id);
        }
        repository.deleteById(id);
        log.info("Veículo removido: {}", id);
    }
}
