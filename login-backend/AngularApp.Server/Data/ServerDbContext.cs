using AngularApp.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace AngularApp.Server.Data
{
    public class ServerDbContext : DbContext
    {
        public ServerDbContext(DbContextOptions db) : base(db)
        {

        }
        public DbSet<ClientesModel> Clientes { get; set; }
        public DbSet<UsuariosModel> Usuarios { get; set; }
    }
}