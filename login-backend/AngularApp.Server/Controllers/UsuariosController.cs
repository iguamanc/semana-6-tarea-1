using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AngularApp.Server.Data;
using AngularApp.Server.Model;
using BCrypt.Net;

namespace AngularApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly ServerDbContext _context;

        public UsuariosController(ServerDbContext context)
        {
            _context = context;
        }

        // GET: api/Usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuariosModel>>> GetUsuariosModel()
        {
            var sessionToken = Request.Cookies["session_token"];
            if (string.IsNullOrEmpty(sessionToken))
            {
                return Unauthorized(new { mensaje = "No autorizado" });
            }
            var usuarios = await _context.Usuarios.ToListAsync();

            return usuarios;
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UsuariosModel>> GetUsuariosModel(int id)
        {
            var sessionToken = Request.Cookies["session_token"];
            if (string.IsNullOrEmpty(sessionToken))
            {
                return Unauthorized(new { mensaje = "No autorizado" });
            }
            var usuariosModel = await _context.Usuarios.FindAsync(id);

            if (usuariosModel == null)
            {
                return NotFound();
            }

            return usuariosModel;
        }

        // PUT: api/Usuarios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuariosModel(int id, UsuariosModel usuariosModel)
        {
            var sessionToken = Request.Cookies["session_token"];
            if (string.IsNullOrEmpty(sessionToken))
            {
                return Unauthorized(new { mensaje = "No autorizado" });
            }
            if (id != usuariosModel.Id)
            {
                return BadRequest();
            }
            usuariosModel.pwd = BCrypt.Net.BCrypt.HashPassword(usuariosModel.pwd);

            //_context.Usuarios.Add(usuariosModel);
            _context.Entry(usuariosModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuariosModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Usuarios
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UsuariosModel>> PostUsuariosModel(UsuariosModel usuariosModel)
        {
            var sessionToken = Request.Cookies["session_token"];
            if (string.IsNullOrEmpty(sessionToken))
            {
                return Unauthorized(new { mensaje = "No autorizado" });
            }
            // Hashear contraseña
            usuariosModel.pwd = BCrypt.Net.BCrypt.HashPassword(usuariosModel.pwd);
            _context.Usuarios.Add(usuariosModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUsuariosModel", new { id = usuariosModel.Id }, usuariosModel);
        }


        // DELETE: api/Usuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuariosModel(int id)
        {
            var sessionToken = Request.Cookies["session_token"];
            if (string.IsNullOrEmpty(sessionToken))
            {
                return Unauthorized(new { mensaje = "No autorizado" });
            }
            var usuariosModel = await _context.Usuarios.FindAsync(id);
            if (usuariosModel == null)
            {
                return NotFound();
            }

            _context.Usuarios.Remove(usuariosModel);
            await _context.SaveChangesAsync();

            return Ok(usuariosModel.Id);
        }

        private bool UsuariosModelExists(int id)
        {
            return _context.Usuarios.Any(e => e.Id == id);
        }
    }
}
