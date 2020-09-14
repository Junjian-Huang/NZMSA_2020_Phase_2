using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NzmsaPhase2BackendAPI.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NzmsaPhase2BackendAPI.Controllers
{
    public class CanvasController : Controller
    {
        private AppDatabase _context;
        private int SIZE = 32;

        public CanvasController(AppDatabase context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetCanvas")]
        public String GetCanvas()
        {
            string[,] output = new string[SIZE, SIZE];

            var canvas = _context.Canvas
                .Include(c => c.ColorData)
                .OrderByDescending(c => c.CanvasID)
                .FirstOrDefault();

            var colorData = canvas.ColorData
                .OrderBy(c => c.RowIndex)
                .ThenBy(c => c.ColumnIndex)
                .ToArray();

            for (int i = 0; i < SIZE; i++)
            {
                for (int j = 0; j < SIZE; j++)
                {
                    output[i, j] = colorData[(SIZE * i) + j].Hex;
                }
            }

            return JsonConvert.SerializeObject(output);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Canvas>> GetCanvasById(int id)
        {
            var canvas = await _context.Canvas
                .Include(c => c.ColorData)
                .FirstOrDefaultAsync(c => c.CanvasID == id);

            if (canvas == null)
            {
                return NotFound();
            }
            return canvas;
        }


        [HttpPut]
        [Route("UpdateCell")]
        public async Task<IActionResult> UpdateCell([FromBody] UpdateCellModel data)
        {
            var tableRow = _context.Canvas
                .Include(c => c.ColorData)
                .OrderByDescending(c => c.CanvasID)
                .FirstOrDefault()
                .ColorData
                .First(row => row.RowIndex == data.Row && row.ColumnIndex == data.Column);
            tableRow.Hex = data.Hex;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class UpdateCellModel
    {
        public int Row { get; set; }

        public int Column { get; set; }

        [Required]
        public String Hex { get; set; }
    }
}
