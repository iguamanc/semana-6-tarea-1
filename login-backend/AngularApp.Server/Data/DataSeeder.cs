using System.Linq;
using AngularApp.Server.Model; // Ajusta según tu namespace
using AngularApp.Server.Data;

namespace AngularApp.Server.Data
{
    public static class DataSeeder
    {
        public static void SeedUsuarios(ServerDbContext context)
        {
            if (!context.Usuarios.Any(u => u.correo == "admin@dominio.com"))
            {
                var usuario = new UsuariosModel
                {
                    nombre = "Administrador",
                    correo = "admin@dominio.com",
                    pwd = BCrypt.Net.BCrypt.HashPassword("1234567890"),
                };

                context.Usuarios.Add(usuario);
                context.SaveChanges();
            }
        }
    }
}
