using Microsoft.AspNetCore.Mvc;
using NzmsaPhase2BackendAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NzmsaPhase2BackendAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColorDatasController : ControllerBase
    {
        private readonly AppDatabase _context;

        public ColorDatasController(AppDatabase context)
        {
            _context = context;
        }

        // GET: api/ColorDatas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ColorData>> GetColorData(int id)
        {
            var colorData = await _context.ColorData.FindAsync(id);

            if (colorData == null)
            {
                return NotFound();
            }

            return colorData;
        }
    }
}
