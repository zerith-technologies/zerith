import { describe, it, expect } from 'vitest';
import * as vehicleService from '../vehicleService';
import { MOCK_VEHICLE } from '../../mocks/handlers';

describe('vehicleService', () => {
  describe('getAll', () => {
    it('retorna lista de veículos', async () => {
      const vehicles = await vehicleService.getAll();
      expect(vehicles).toHaveLength(1);
      expect(vehicles[0].placa).toBe(MOCK_VEHICLE.placa);
      expect(vehicles[0].modelo).toBe(MOCK_VEHICLE.modelo);
    });
  });

  describe('getById', () => {
    it('retorna veículo pelo id correto', async () => {
      const vehicle = await vehicleService.getById(MOCK_VEHICLE.id);
      expect(vehicle.id).toBe(MOCK_VEHICLE.id);
      expect(vehicle.marca).toBe(MOCK_VEHICLE.marca);
      expect(vehicle.status).toBe(MOCK_VEHICLE.status);
    });

    it('lança erro para id inexistente', async () => {
      await expect(vehicleService.getById('id-invalido')).rejects.toThrow();
    });
  });
});
