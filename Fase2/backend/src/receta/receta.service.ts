import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RecetaRepositorio } from './entities/receta.repository.js';
import { Receta } from './entities/receta.entity.js';
import { CreateRecetaDto } from './dto/create-receta.dto.js';
import { UpdateRecetaDto } from './dto/update-receta.dto.js';

@Injectable()
export class RecetaService {
  constructor(private readonly repositorio: RecetaRepositorio) {}

  findAll(): Promise<Receta[]> {
    return this.repositorio.findAll();
  }

  async findById(idReceta: number): Promise<Receta> {
    const registro = await this.repositorio.findById(idReceta);
    if (!registro)
      throw new NotFoundException('Registro de receta no encontrado');
    return registro;
  }

  async create(dto: CreateRecetaDto): Promise<Receta> {
    const data = this.convertir(dto);
    await this.repositorio.validarReferencias(data);
    return this.repositorio.create(data);
  }

  async update(idReceta: number, dto: UpdateRecetaDto): Promise<Receta> {
    const data = this.convertir(dto);
    if (!Object.keys(data).length)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    await this.findById(idReceta);
    await this.repositorio.validarReferencias(data);
    const registro = await this.repositorio.update(idReceta, data);
    if (!registro)
      throw new NotFoundException('Registro de receta no encontrado');
    return registro;
  }

  async delete(idReceta: number): Promise<{ message: string }> {
    if (!(await this.repositorio.delete(idReceta))) {
      throw new NotFoundException('Registro de receta no encontrado');
    }
    return { message: 'Registro de receta eliminado' };
  }

  private convertir(dto: CreateRecetaDto | UpdateRecetaDto): Partial<Receta> {
    const data: Partial<Receta> = {};
    if ('consultaId' in dto && dto.consultaId !== undefined)
      data.consultaId = dto.consultaId;
    return data;
  }
}
