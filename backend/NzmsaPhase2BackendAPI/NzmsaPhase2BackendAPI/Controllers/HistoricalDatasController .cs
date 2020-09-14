using Microsoft.AspNetCore.Mvc;
using NzmsaPhase2BackendAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace NzmsaPhase2BackendAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoricalDatasController : ControllerBase
    {
        private readonly AppDatabase _context;

        public HistoricalDatasController(AppDatabase context)
        {
            _context = context;
        }


        // GET: api/HistoricalData
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HistoricalData>>> GetHistoricalData()
        {
            return await _context.HistoricalData.ToListAsync();
        }

    }
}
