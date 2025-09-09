using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AngularApp.Server.Data;
using AngularApp.Server.Model;
using AngularApp.Server.DTOs;
using System.Linq;
using BCrypt.Net;

namespace AngularApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AutenticacionController : ControllerBase
    {
        private readonly ServerDbContext _context;

        public AutenticacionController(ServerDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto login)
        {
            // Buscar usuario en la base de datos
            var usuarioDb = _context.Usuarios
                            .FirstOrDefault(u => u.correo == login.correo);

                if (usuarioDb != null && BCrypt.Net.BCrypt.Verify(login.contrasena, usuarioDb.pwd))
            {
                // Generar token de sesión
                var sessionToken = Guid.NewGuid().ToString();

                // Guardar cookie con el token
                Response.Cookies.Append("session_token", sessionToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false, // poner true si es HTTPS
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddHours(1)
                });
          
                return Ok(new { mensaje = "Login exitoso" });
            }
            // Si login falla, eliminar cualquier cookie anterior
            if (Request.Cookies.ContainsKey("session_token"))
            {
                Response.Cookies.Delete("session_token");
            }


            return Unauthorized(new { mensaje = "Usuario o contraseña incorrectos" });
        }

        [HttpGet("session")]
        public IActionResult CheckSession()
        {
            if (Request.Cookies.TryGetValue("session_token", out string usuario))
            {
                return Ok(new { usuario });
            }
            return Unauthorized();
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("session_token");
            return Ok(new { mensaje = "Sesión cerrada" });
        }
    }
}
