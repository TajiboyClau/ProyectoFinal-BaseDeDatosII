/* venta y detalle de venta */

BEGIN;

WITH nueva_venta AS (
    INSERT INTO venta(
        paciente_id,
        fecha_venta,
        estado_venta,
        tipo_pago_id
    )
    VALUES (
        1,
        CURRENT_TIMESTAMP,
        'Completada',
        1
    )
    RETURNING id_venta
)
INSERT INTO detalle_venta(
    id_venta,
    id_producto,
    detalle_venta_cantidad,
    detalle_venta_precio,
    detalle_venta_descuento
)
SELECT
    id_venta,
    1,
    2,
    25.00,
    0.00
FROM nueva_venta;

COMMIT;

/* pago de una cita */

BEGIN;

INSERT INTO pagos(
    cita_id,
    tipo_pago_id,
    monto_pago,
    fecha_pago,
    estado_pago
)
VALUES (
    1,
    1,
    150.00,
    CURRENT_TIMESTAMP,
    'Pagado'
);

COMMIT;

/* registro de una consulta */

BEGIN;

INSERT INTO consulta(
    cita_id,
    fecha_hora_inicio,
    motivo_consulta,
    sintomas,
    observaciones,
    plan_tratamiento
)
VALUES (
    1,
    CURRENT_TIMESTAMP,
    'Consulta general',
    'Dolor de cabeza',
    'Se realiza evaluación médica',
    'Tomar medicamento y descansar'
);

COMMIT;