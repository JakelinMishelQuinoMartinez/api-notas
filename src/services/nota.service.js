import { Nota } from "../models/nota.model.js";
export const notaService = {
  crear: (datos) => Nota.create(datos),
  listar: () => Nota.find().sort({ createdAt: -1 }),
  buscarPorId: (id) => Nota.findById(id),
  actualizar: (id, datos) => Nota.findByIdAndUpdate(id, datos, {
    new: true, runValidators: true,
  }),
  eliminar: (id) => Nota.findByIdAndDelete(id),
};