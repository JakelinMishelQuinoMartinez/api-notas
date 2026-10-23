import { CrearNotaDTO } from "../dtos/crear-nota.dto.js";
import { ActualizarNotaDTO } from "../dtos/actualizar-nota.dto.js";
import { notaService } from "../services/nota.service.js";

export async function crearNota(req, res, next) {
  try {
    const datos = new CrearNotaDTO(req.body);
    const nota = await notaService.crear(datos);
    res.status(201).json({ data: nota });
  } catch (error) { next(error); }
}