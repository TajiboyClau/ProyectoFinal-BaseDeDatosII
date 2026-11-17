	/* procedimiento para agregar productos */

CREATE PROCEDURE agregar_producto(
    p_nombre VARCHAR,
    p_precio NUMERIC,
    p_estado BOOLEAN DEFAULT TRUE
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_nombre IS NULL OR p_nombre = '' THEN
        RAISE EXCEPTION 'El nombre del producto es obligatorio';
    END IF;

    IF p_precio <= 0 THEN
        RAISE EXCEPTION 'El precio debe ser mayor que 0';
    END IF;

    INSERT INTO producto(
        nombre_producto,
        precio_producto,
        estado_producto
    )
    VALUES (
        p_nombre,
        p_precio,
        p_estado
    );

    RAISE NOTICE 'Producto agregado';
END;
$$;

CALL agregar_producto(
    'Jarabe para la Tos',
    20.00,
    TRUE
);

/* procedimiento para agregar pacientes */

CREATE PROCEDURE agregar_paciente(
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_dpi VARCHAR,
    p_telefono VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_nombre IS NULL OR p_nombre = '' THEN
        RAISE EXCEPTION 'El nombre del paciente es obligatorio';
    END IF;

    IF p_apellido IS NULL OR p_apellido = '' THEN
        RAISE EXCEPTION 'El apellido del paciente es obligatorio';
    END IF;

    INSERT INTO paciente(
        paciente_nombre,
        paciente_apellido,
        paciente_dpi,
        paciente_telefono
    )
    VALUES (
        p_nombre,
        p_apellido,
        p_dpi,
        p_telefono
    );

    RAISE NOTICE 'Paciente agregado';
END;
$$;

CALL agregar_paciente(
    'Andrea',
    'Ramirez',
    '4567891230101',
    '5555-7777'
);

/* procedimiento para registrar pagos */

CREATE PROCEDURE registrar_pago(
    p_cita_id INT,
    p_tipo_pago_id INT,
    p_monto NUMERIC,
    p_fecha TIMESTAMP,
    p_estado VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM cita
        WHERE id_cita = p_cita_id
    ) THEN
        RAISE EXCEPTION 'La cita no existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM tipo_pago
        WHERE id_tipo_pago = p_tipo_pago_id
    ) THEN
        RAISE EXCEPTION 'El tipo de pago no existe';
    END IF;

    IF p_monto <= 0 THEN
        RAISE EXCEPTION 'El monto debe ser mayor que 0';
    END IF;

    INSERT INTO pagos(
        cita_id,
        tipo_pago_id,
        monto_pago,
        fecha_pago,
        estado_pago
    )
    VALUES (
        p_cita_id,
        p_tipo_pago_id,
        p_monto,
        p_fecha,
        p_estado
    );

    RAISE NOTICE 'Pago registrado';
END;
$$;

CALL registrar_pago(
    1,
    1,
    150.00,
    '2026-09-10 08:45:00',
    'Pagado'
);