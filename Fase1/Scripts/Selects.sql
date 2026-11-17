/* listado de pacientes */

SELECT pac.id_paciente AS identificador,
       pac.paciente_nombre AS nombre,
       pac.paciente_apellido AS apellido,
       pac.paciente_dpi AS dpi,
       pac.paciente_telefono AS telefono
FROM paciente pac;


/* listado de productos */

SELECT prod.id_producto AS identificador,
       prod.nombre_producto AS producto,
       prod.precio_producto AS precio,
       prod.estado_producto AS estado
FROM producto prod;


/* citas con paciente, doctor, enfermero y consultorio */

SELECT cit.id_cita AS identificador,
       pac.paciente_nombre AS paciente,
       pac.paciente_apellido AS apellido,
       doc.doctor_nombre AS doctor,
       enf.enfermero_nombre AS enfermero,
       con.nombre_consultorio AS consultorio,
       cit.fecha_cita AS fecha,
       cit.hora_cita AS hora,
       cit.estado_cita AS estado
FROM cita cit
JOIN paciente pac
    ON pac.id_paciente = cit.paciente_id
JOIN doctor doc
    ON doc.doctor_id = cit.doctor_id
JOIN enfermero enf
    ON enf.enfermero_id = cit.enfermero_id
JOIN consultorio con
    ON con.id_consultorio = cit.consultorio_id;


/* doctores y sus especialidades */

SELECT doc.doctor_id AS identificador,
       doc.doctor_nombre AS nombre,
       doc.doctor_apellido AS apellido,
       esp.nombre_especialidad AS especialidad,
       doc.telefono AS telefono,
       doc.correo AS correo
FROM doctor doc
JOIN especialidad esp
    ON esp.id_especialidad = doc.doctor_especialidad;


/* consultas con diagnosticos */

SELECT con.id_consulta AS identificador,
       pac.paciente_nombre AS paciente,
       pac.paciente_apellido AS apellido,
       con.fecha_hora_inicio AS fecha,
       con.motivo_consulta AS motivo,
       dia.diagnostico AS diagnostico
FROM consulta con
JOIN cita cit
    ON cit.id_cita = con.cita_id
JOIN paciente pac
    ON pac.id_paciente = cit.paciente_id
JOIN diagnostico dia
    ON dia.consulta_id = con.id_consulta;


/* historial clinico de los pacientes */

SELECT his.id_historial AS identificador,
       pac.paciente_nombre AS paciente,
       pac.paciente_apellido AS apellido,
       his.fecha_apertura AS fecha_apertura,
       his.grupo_sanguineo AS grupo_sanguineo,
       his.alergias AS alergias,
       his.antecedentes AS antecedentes,
       his.estado_historial AS estado
FROM historial_clinico his
JOIN paciente pac
    ON pac.id_paciente = his.paciente_id;


/* recetas con sus productos */

SELECT rec.id_receta AS identificador,
       pac.paciente_nombre AS paciente,
       pac.paciente_apellido AS apellido,
       prod.nombre_producto AS producto,
       det.detalle_receta_frecuencia AS frecuencia,
       det.detalle_receta_cantidad AS cantidad,
       det.via_administracion AS via
FROM receta rec
JOIN consulta con
    ON con.id_consulta = rec.consulta_id
JOIN cita cit
    ON cit.id_cita = con.cita_id
JOIN paciente pac
    ON pac.id_paciente = cit.paciente_id
JOIN detalle_receta det
    ON det.id_receta = rec.id_receta
JOIN producto prod
    ON prod.id_producto = det.id_producto;


/* productos con precio mayor a cinco */

SELECT prod.id_producto AS identificador,
       prod.nombre_producto AS producto,
       prod.precio_producto AS precio,
       prod.estado_producto AS estado
FROM producto prod
WHERE prod.precio_producto > 5;


/* citas de un paciente */

SELECT cit.id_cita AS identificador,
       pac.paciente_nombre AS paciente,
       pac.paciente_apellido AS apellido,
       cit.fecha_cita AS fecha,
       cit.hora_cita AS hora,
       cit.estado_cita AS estado
FROM cita cit
JOIN paciente pac
    ON pac.id_paciente = cit.paciente_id
WHERE pac.id_paciente = 1;


/* pagos realizados por tipo de pago */

SELECT pag.id_pago AS identificador,
       pac.paciente_nombre AS paciente,
       pac.paciente_apellido AS apellido,
       tip.nombre_tipo_pago AS tipo_pago,
       pag.monto_pago AS monto,
       pag.fecha_pago AS fecha,
       pag.estado_pago AS estado
FROM pagos pag
JOIN cita cit
    ON cit.id_cita = pag.cita_id
JOIN paciente pac
    ON pac.id_paciente = cit.paciente_id
JOIN tipo_pago tip
    ON tip.id_tipo_pago = pag.tipo_pago_id
WHERE tip.id_tipo_pago = 1;


/* movimientos del inventario */

SELECT mov.id_movimiento AS identificador,
       prod.nombre_producto AS producto,
       mov.tipo_movimiento AS movimiento,
       mov.cantidad AS cantidad,
       mov.fecha_movimiento AS fecha
FROM movimiento_inventario mov
JOIN producto prod
    ON prod.id_producto = mov.id_producto;


/* ventas con productos y tipo de pago */

SELECT ven.id_venta AS venta,
       pac.paciente_nombre AS paciente,
       pac.paciente_apellido AS apellido,
       prod.nombre_producto AS producto,
       det.detalle_venta_cantidad AS cantidad,
       det.detalle_venta_precio AS precio,
       tip.nombre_tipo_pago AS tipo_pago,
       ven.estado_venta AS estado
FROM venta ven
JOIN paciente pac
    ON pac.id_paciente = ven.paciente_id
JOIN tipo_pago tip
    ON tip.id_tipo_pago = ven.tipo_pago_id
JOIN detalle_venta det
    ON det.id_venta = ven.id_venta
JOIN producto prod
    ON prod.id_producto = det.id_producto;