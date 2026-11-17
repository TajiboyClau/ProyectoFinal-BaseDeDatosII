/* validar precio del producto */

CREATE FUNCTION fn_validar_precio_producto()
RETURNS TRIGGER AS $$
BEGIN

    IF NEW.precio_producto <= 0 THEN
        RAISE EXCEPTION 'El precio debe ser mayor que 0';
    END IF;

    RETURN NEW;

END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_precio_producto
BEFORE INSERT OR UPDATE ON producto
FOR EACH ROW
EXECUTE FUNCTION fn_validar_precio_producto();


/* validar movimiento de inventario */

CREATE FUNCTION fn_validar_movimiento_inventario()
RETURNS TRIGGER AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM producto
        WHERE id_producto = NEW.id_producto
    ) THEN
        RAISE EXCEPTION 'El producto no existe';
    END IF;

    IF NEW.cantidad <= 0 THEN
        RAISE EXCEPTION 'La cantidad debe ser mayor que 0';
    END IF;

    RETURN NEW;

END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_movimiento_inventario
BEFORE INSERT ON movimiento_inventario
FOR EACH ROW
EXECUTE FUNCTION fn_validar_movimiento_inventario();


/* actualizar estado de la cita */

CREATE FUNCTION fn_actualizar_estado_cita()
RETURNS TRIGGER AS $$
BEGIN

    UPDATE cita
    SET estado_cita = 'Atendida'
    WHERE id_cita = NEW.cita_id;

    RETURN NEW;

END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_estado_cita
AFTER INSERT ON consulta
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_estado_cita();