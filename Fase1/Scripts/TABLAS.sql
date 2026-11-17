CREATE TABLE especialidad (
    id_especialidad SERIAL,
    nombre_especialidad VARCHAR(100) NOT NULL
);

CREATE TABLE consultorio (
    id_consultorio SERIAL,
    nombre_consultorio VARCHAR(100) NOT NULL
);

CREATE TABLE paciente (
    id_paciente SERIAL,
    paciente_nombre VARCHAR(100) NOT NULL,
    paciente_apellido VARCHAR(100) NOT NULL,
    paciente_dpi VARCHAR(30),
    paciente_telefono VARCHAR(30)
);

CREATE TABLE doctor (
    doctor_id SERIAL,
    doctor_nombre VARCHAR(100) NOT NULL,
    doctor_apellido VARCHAR(100) NOT NULL,
    doctor_especialidad VARCHAR(100),
    telefono VARCHAR(30),
    correo VARCHAR(100)
);

CREATE TABLE enfermero (
    enfermero_id SERIAL,
    enfermero_nombre VARCHAR(100) NOT NULL,
    enfermero_apellido VARCHAR(100) NOT NULL
);

CREATE TABLE producto (
    id_producto SERIAL,
    nombre_producto VARCHAR(100) NOT NULL,
    precio_producto NUMERIC(10,2) NOT NULL,
    estado_producto BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE cita (
    id_cita SERIAL,
    paciente_id INT,
    doctor_id INT,
    enfermero_id INT,
    consultorio_id INT,
    fecha_cita DATE,
    hora_cita TIME,
    estado_cita VARCHAR(50),
    motivo_cita VARCHAR(200)
);

CREATE TABLE historial_clinico (
    id_historial SERIAL,
    paciente_id INT,
    fecha_apertura DATE,
    grupo_sanguineo VARCHAR(10),
    alergias VARCHAR(250),
    antecedentes VARCHAR(250),
    estado_historial VARCHAR(50)
);

CREATE TABLE consulta (
    id_consulta SERIAL,
    cita_id INT,
    fecha_hora_inicio TIMESTAMP,
    motivo_consulta VARCHAR(200),
    sintomas VARCHAR(500),
    observaciones VARCHAR(500),
    plan_tratamiento VARCHAR(500)
);

CREATE TABLE diagnostico (
    id_diagnostico SERIAL,
    consulta_id INT,
    diagnostico VARCHAR(500)
);

CREATE TABLE receta (
    id_receta SERIAL,
    consulta_id INT
);

CREATE TABLE detalle_receta (
    id_receta INT,
    id_producto INT,
    detalle_receta_frecuencia VARCHAR(100),
    detalle_receta_cantidad NUMERIC(10,2),
    via_administracion VARCHAR(100),
    observaciones VARCHAR(250)
);

CREATE TABLE movimiento_inventario (
    id_movimiento SERIAL,
    id_producto INT,
    tipo_movimiento VARCHAR(50),
    cantidad NUMERIC(10,2),
    fecha_movimiento TIMESTAMP
);

CREATE TABLE venta (
    id_venta SERIAL,
    paciente_id INT,
    fecha_venta TIMESTAMP,
    forma_pago VARCHAR(50),
    estado_venta VARCHAR(50)
);

CREATE TABLE detalle_venta (
    id_venta INT,
    id_producto INT,
    detalle_venta_cantidad NUMERIC(10,2),
    detalle_venta_precio NUMERIC(10,2),
    detalle_venta_descuento NUMERIC(10,2)
);

CREATE TABLE tipo_pago (
    id_tipo_pago SERIAL,
    nombre_tipo_pago VARCHAR(50) NOT NULL
);

CREATE TABLE pagos (
    id_pago SERIAL,
    cita_id INT,
    tipo_pago_id INT,
    monto_pago NUMERIC(10,2),
    fecha_pago TIMESTAMP,
    estado_pago VARCHAR(50)
);

ALTER TABLE venta
ADD COLUMN tipo_pago_id INT;