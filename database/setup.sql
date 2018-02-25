use insumos;
create table insumo (insumo_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, tipo TEXT, proveedor TEXT, cantidad INT, costo_unidad DECIMAL, fecha_in_inventario DATETIME);
insert into insumo (tipo, proveedor, cantidad, costo_unidad, fecha_in_inventario) values ('bombilloLEDXL', 'proveedorBombillos', 100, 200000, NOW());
