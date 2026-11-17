import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module.js';
import { referenciasClinica } from '../entidades-clinica.js';

// Inspección de metadatos: no ejecuta DDL ni modifica registros.
async function verificar(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error'],
    abortOnError: false,
  });
  try {
    const db = app.get(DataSource);
    const columnas: {
      table_name: string;
      column_name: string;
      data_type: string;
      character_maximum_length: number | null;
      numeric_precision: number | null;
      numeric_scale: number | null;
    }[] = await db.query(
      `SELECT table_name, column_name, data_type, character_maximum_length, numeric_precision, numeric_scale FROM information_schema.columns WHERE table_schema = 'public'`,
    );
    const primarias: { table_name: string; column_name: string }[] =
      await db.query(`
      SELECT t.table_name, k.column_name
      FROM information_schema.table_constraints t
      JOIN information_schema.key_column_usage k
        ON k.constraint_schema=t.constraint_schema AND k.constraint_name=t.constraint_name AND k.table_name=t.table_name
      WHERE t.table_schema='public' AND t.constraint_type='PRIMARY KEY'`);
    const foraneas: {
      tabla: string;
      columna: string;
      tabla_referencia: string;
      columna_referencia: string;
    }[] = await db.query(`
      SELECT origen.relname AS tabla, a.attname AS columna,
        destino.relname AS tabla_referencia, b.attname AS columna_referencia
      FROM pg_constraint c
      JOIN pg_class origen ON origen.oid=c.conrelid
      JOIN pg_namespace n ON n.oid=origen.relnamespace
      JOIN pg_class destino ON destino.oid=c.confrelid
      CROSS JOIN LATERAL unnest(c.conkey, c.confkey) AS claves(local_id, referencia_id)
      JOIN pg_attribute a ON a.attrelid=c.conrelid AND a.attnum=claves.local_id
      JOIN pg_attribute b ON b.attrelid=c.confrelid AND b.attnum=claves.referencia_id
      WHERE c.contype='f' AND n.nspname='public'`);
    const errores: string[] = [];
    const tipos: Record<string, string> = {
      int: 'integer',
      varchar: 'character varying',
      numeric: 'numeric',
      boolean: 'boolean',
      date: 'date',
      time: 'time without time zone',
      timestamp: 'timestamp without time zone',
    };
    for (const entidad of db.entityMetadatas) {
      if (!columnas.some((c) => c.table_name === entidad.tableName)) {
        errores.push('Falta la tabla public.' + entidad.tableName);
        continue;
      }
      for (const columna of entidad.columns) {
        const real = columnas.find(
          (c) =>
            c.table_name === entidad.tableName &&
            c.column_name === columna.databaseName,
        );
        const etiqueta = entidad.tableName + '.' + columna.databaseName;
        if (!real) {
          errores.push('Falta la columna ' + etiqueta);
          continue;
        }
        const tipo =
          columna.type === Number ? 'integer' : tipos[String(columna.type)];
        if (tipo && real.data_type !== tipo)
          errores.push(
            etiqueta + ': se esperaba ' + tipo + ', existe ' + real.data_type,
          );
        if (
          columna.length &&
          Number(columna.length) !== real.character_maximum_length
        )
          errores.push(etiqueta + ': longitud distinta de ' + columna.length);
        if (
          columna.precision &&
          (real.numeric_precision !== columna.precision ||
            real.numeric_scale !== columna.scale)
        )
          errores.push(etiqueta + ': precisión o escala decimal distinta');
      }
      const esperadas = entidad.primaryColumns
        .map((c) => c.databaseName)
        .sort()
        .join(',');
      const reales = primarias
        .filter((p) => p.table_name === entidad.tableName)
        .map((p) => p.column_name)
        .sort()
        .join(',');
      if (esperadas !== reales)
        errores.push(
          entidad.tableName + ': revisar llave primaria (' + esperadas + ')',
        );
    }
    for (const ref of referenciasClinica) {
      if (
        !foraneas.some(
          (f) =>
            f.tabla === ref.tabla &&
            f.columna === ref.columna &&
            f.tabla_referencia === ref.tablaReferencia &&
            f.columna_referencia === ref.columnaReferencia,
        )
      ) {
        errores.push(
          'Falta la relación ' +
            ref.tabla +
            '.' +
            ref.columna +
            ' con ' +
            ref.tablaReferencia +
            '.' +
            ref.columnaReferencia,
        );
      }
    }
    if (errores.length) {
      console.error(errores.join('\n'));
      process.exitCode = 1;
    } else {
      console.log(
        'Las 17 tablas, columnas esperadas, llaves primarias y referencias coinciden con el backend.',
      );
      console.log(
        'No se modificaron datos. Esta revisión no verifica procedimientos, triggers ni todos los permisos.',
      );
    }
  } finally {
    await app.close();
  }
}
verificar().catch(() => {
  console.error(
    'No se pudo verificar el esquema. Revisa la conexión y el certificado en .env.',
  );
  process.exitCode = 1;
});
