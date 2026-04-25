import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentasComponent } from './venta.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('VentasComponent', () => {
  let component: VentasComponent;
  let fixture: ComponentFixture<VentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Si es Standalone, se importa aquí. Si no, va en declarations.
      imports: [ 
        VentasComponent, 
        RouterTestingModule, 
        FormsModule 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente de ventas', () => {
    expect(component).toBeTruthy();
  });

  it('debería iniciar con el carrito vacío y total en cero', () => {
    expect(component.carrito.length).toBe(0);
    expect(component.totalVenta).toBe(0);
  });

  it('debería calcular el total correctamente al agregar productos', () => {
    const productoSimulado = { id: 1, nombre: 'Test Med', precio: 10.00, stock: 50 };
    
    component.agregarAlCarrito(productoSimulado);
    
    expect(component.carrito.length).toBe(1);
    expect(component.totalVenta).toBe(10.00);
  });

  it('debería actualizar el total cuando se cambia la cantidad de un producto', () => {
    const productoSimulado = { id: 1, nombre: 'Test Med', precio: 5.00, stock: 50 };
    component.agregarAlCarrito(productoSimulado);
    
    // Simulamos cambio de cantidad a 3
    component.carrito[0].cantidad = 3;
    component.carrito[0].subtotal = component.carrito[0].precio * component.carrito[0].cantidad;
    component.calcularTotal();
    
    expect(component.totalVenta).toBe(15.00);
  });

  it('debería eliminar un producto del carrito y recalcular el total', () => {
    component.agregarAlCarrito({ id: 1, nombre: 'A', precio: 10, stock: 10 });
    component.agregarAlCarrito({ id: 2, nombre: 'B', precio: 20, stock: 10 });
    
    component.eliminarItem(0); // Eliminamos el de 10
    
    expect(component.carrito.length).toBe(1);
    expect(component.totalVenta).toBe(20.00);
  });
});