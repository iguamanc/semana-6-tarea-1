using AngularApp.Server.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Cadena de conexión
var conexion = builder.Configuration.GetConnectionString("cn")
    ?? throw new InvalidOperationException("No existe la base de datos");

builder.Services.AddDbContext<ServerDbContext>(
    op => op.UseMySql(conexion, ServerVersion.Parse("5.7.24")));

// Agregar controladores
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:4200") // URL de Angular
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials(); // Muy importante para cookies
    });
});

var app = builder.Build();

// Archivos estáticos
app.UseDefaultFiles();
app.UseStaticFiles();

// Swagger en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS debe ir **antes de UseAuthorization** y MapControllers
app.UseCors("MyPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

// Mapear controladores
app.MapControllers();

// Fallback a Angular
app.MapFallbackToFile("/index.html");

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ServerDbContext>();
    context.Database.Migrate(); // Aplica migraciones si no están aplicadas
    DataSeeder.SeedUsuarios(context); // Llama al seed
}

app.Run();
